import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

const alphabet = ['A', 'B', 'C', 'D']

const answersStyling = (choice: Choices) => {
  if (choice.selected) {
    if (choice.isSelectedCorrect === undefined) {
      return 'selected'
    } else {
      if (choice.isSelectedCorrect) {
        return 'selected_correct'
      } else {
        return 'selected_not_correct'
      }
    }
  } else if (choice.isNotSelectedCorrect !== undefined) {
    if (choice.isNotSelectedCorrect) {
      return 'not_selected_correct'
    } else {
      return 'not_selected_not_correct'
    }
  }
}

type Props = {
  userInfos?: UserInfos
}

type State = {
  currentQuiz?: number
  allQuestions: Array<Question>
  currentQuestion: number
  isSubmitable: boolean
}

type UserInfos = {
  id: string
  user: string
}

type Choices = {
  correct: boolean
  selected?: boolean
  isSelectedCorrect?: boolean
  isNotSelectedCorrect?: boolean
  key: number
  text: string

}

interface Question {
  idQuiz?: number
  idQuestion: number
  choices: Array<Choices>
  img: string | undefined
  text: string
  isValidated?: boolean
  _idUser?: string
}

const randomQuiz = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Quiz extends React.Component<RouteComponentProps & Props, State> {
  state: State = {
    currentQuiz: undefined,
    allQuestions: [],
    currentQuestion: 0,
    isSubmitable: false
  }

  componentDidMount() {
    const queryString = this.props.location.search
    const urlParams = new URLSearchParams(queryString)
    const idQuiz = urlParams.get('idQuiz')
    if (idQuiz == null || idQuiz == '0') {
      const randomQuizId = randomQuiz(1, 8)
      this.setState({currentQuiz: randomQuizId})
      this.All_Questions(randomQuizId)
    } else {
      this.setState({currentQuiz: parseInt(idQuiz)})
      this.All_Questions(parseInt(idQuiz))
    }
    console.log(this.props)
    let openRequest = indexedDB.open('quiz', 1)
    openRequest.onupgradeneeded = (e) => {
      let db = openRequest.result
      if (!db.objectStoreNames.contains("answers")) {
        db.createObjectStore('answers')
      } else {
        let transaction = db.transaction('answers', 'readwrite')
        transaction.objectStore("answers").clear()
      }
      db.close()
    }
    openRequest.onsuccess = (e) => {
      let db = openRequest.result
      if (db.objectStoreNames.contains("answers")) {
        let transaction = db.transaction('answers', 'readwrite')
        transaction.objectStore("answers").clear()
      }
      db.close()
    }
  }

  All_Questions = async (idQuiz: number) => {
    let fet = await fetch('http://192.168.1.26:3500/all-questions', {
      method: "POST",
      body: JSON.stringify({
        idQuiz: idQuiz
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let rep: Question[] = await fet.json()
    console.log(rep)
    this.setState({allQuestions: rep})
  }

  Finish_Quiz = async () => {
    let allQuestions: Question[] = this.state.allQuestions
    for (let i = 0; i < allQuestions.length; i++) {
      allQuestions[i]._idUser = this.props.userInfos?.id
      allQuestions[i].img = undefined
    }
    const request = await fetch('http://192.168.1.26:3500/add-quiz-corrected', {
      method: "PUT",
      body: JSON.stringify({
        quizCorrected: allQuestions
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 201) {
      window.location.href = `${window.location.origin}/#/result`
      // this.props.navigation.navigate('QuizResult', {correctedQuiz: rep.correctedQuiz})
    }
  } 

  Add_To_IDB = (question: Question[]) => {
    delete question[0].img
    let openRequest = indexedDB.open('quiz')
    openRequest.onsuccess = function(e) {
      let db = openRequest.result
      let transaction = db.transaction('answers', 'readwrite')
      transaction.objectStore("answers").add(question, question[0].idQuestion)
    }
  }

  Choose_Answer = (questionIndex: number, choiceIndex: number) => {
    let allQuestions: Question[] = this.state.allQuestions
    const currentQuestion: Question[] = []
    const currentQuestionIndexes: Array<number> = []
    allQuestions.map((question, questionIndex) => {
      if (question.idQuestion == this.state.currentQuestion) {
        currentQuestion.push(question)
        currentQuestionIndexes.push(questionIndex)
      }
    })
    allQuestions[currentQuestionIndexes[questionIndex]].choices[choiceIndex].selected = !allQuestions[currentQuestionIndexes[questionIndex]].choices[choiceIndex].selected
    let isSubmitable = false
    for (let i = 0; i < currentQuestion.length; i++) {
      for (let j = 0; j < currentQuestion[i].choices.length; j++) {
        if (currentQuestion[i].choices[j].selected) {
          isSubmitable = true
          break
        }
      }
    }
    this.setState({allQuestions, isSubmitable})
  }

  Question_Correction = () => {
    let areChoicesCorrect = true
    let allQuestions = this.state.allQuestions
    let fullCurrentQuestion: Question[] = []
    allQuestions.map((question, questionIndex) => {
      if (question.idQuestion == this.state.currentQuestion) {
        question.choices.map((choice, choiceIndex) => {
          if (choice.selected) {
            if (choice.correct) {
              allQuestions[questionIndex].choices[choiceIndex].isSelectedCorrect = true
            } else {
              allQuestions[questionIndex].choices[choiceIndex].isSelectedCorrect = false
              areChoicesCorrect = false
            }
          } else if (!choice.selected) {
            if (choice.correct) {
              allQuestions[questionIndex].choices[choiceIndex].isNotSelectedCorrect = true
              areChoicesCorrect = false
            } else {
              allQuestions[questionIndex].choices[choiceIndex].isNotSelectedCorrect = false
            }
          } else {
            areChoicesCorrect = false
          }
        })
        allQuestions[questionIndex].isValidated = areChoicesCorrect
        fullCurrentQuestion.push(allQuestions[questionIndex])
      }
    })
    this.Add_To_IDB(fullCurrentQuestion)
    this.setState({allQuestions})
  }

  Next_Question = () => {
    const isLastQuestion: boolean = !(this.state.allQuestions?.filter((r) => r.idQuestion == this.state.currentQuestion + 1).length > 0)
    if (!isLastQuestion) {
      this.setState({
        currentQuestion: this.state.currentQuestion + 1,
        isSubmitable: this.state.isSubmitable
      })
    } else {
      this.Finish_Quiz()
    }
  }

  render() {
    return (
      <div className='quiz_container'>
        <div className='big_question_container'>
          <div className='question_container'>
            <div id='img'>
            {
              this.state.allQuestions.filter((r) => r.idQuestion == this.state.currentQuestion).map((question, questionIndex) => {
                if (questionIndex == 0 && question.img) {
                  return <img src={question.img} key={`img${questionIndex}`} />
                }
              })
            }
            </div>
          {
            this.state.allQuestions.filter((r) => r.idQuestion == this.state.currentQuestion).map((question, questionIndex) => (
              <div className='question_box' key={`QI${questionIndex}`}>
                <span className='question_text'>{question.text}</span>
                <div className='answers_container'>
              {
                question.choices.map((choice, choiceIndex) => (
                  <div className={`answers_box ${answersStyling(choice)}`} onClick={() => this.Choose_Answer(questionIndex, choiceIndex)}  key={choiceIndex}>
                    <span className={`answers_box_letter ${answersStyling(choice)}`}>{alphabet[choice.key]}</span>
                    <span className={`answers_box_text ${answersStyling(choice)}`}>{choice.text}</span>
                  </div>
                ))
              }
                </div>
              </div>
            ))
          }
          </div>
          {
            this.state.allQuestions.filter((r) => r.idQuestion == this.state.currentQuestion).map((question, questionIndex) => {
              let isCorrect = true
              this.state.allQuestions.map(question => {
                if (isCorrect && (question.idQuestion == this.state.currentQuestion)) {
                  isCorrect = question.isValidated ? true : false
                }
              })
              if (questionIndex == 0) {
                return (
                  question.isValidated !== undefined
                  ?
                  <div className='question_submit_box' key={`questionSubmit${questionIndex}`}>
                    <button className="btn_enabled" onClick={this.Next_Question}>Continuer</button>
                  </div>
                  :
                  <div className='question_submit_box' key={`questionSubmit${questionIndex}`}>
                    <button className={`${!this.state.isSubmitable ? 'btn_disabled' : 'btn_enabled'}`} style={{color: !this.state.isSubmitable ? '#737373' : '#fff'}} onClick={this.Question_Correction} disabled={!this.state.isSubmitable}>Valider mes réponses</button>
                  </div>
                )
              }
            })
          }
        </div>
        <div className='side_container'>
          <div className='side_title_box'>
            <h4>Question {this.state.currentQuestion + 1}/5</h4>
            <div className='side_icon'></div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Quiz)