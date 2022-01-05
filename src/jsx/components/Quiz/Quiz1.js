import React from "react";
import img from '../../assets/image1.jpg'

const alphabet = ['A', 'B', 'C', 'D']

const answersStyling = (choice) => {
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

export default class Quiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allQuestions: [],
      currentQuestion: 0,
      isSubmitable: false
    }
  }

  componentDidMount() {
    this.All_Questions()
  }

  All_Questions = async () => {
    let fet = await fetch('http://192.168.1.26:3500/all-questions', {
      method: "POST",
      body: JSON.stringify({
        idQuiz: 3
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let rep = await fet.json()
    console.log(rep)
    this.setState({allQuestions: rep})
  }

  Choose_Answer = (questionIndex, choiceIndex) => {
    let allQuestions = this.state.allQuestions
    const currentQuestion = []
    const currentQuestionIndexes = []
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
      }
    })
    this.setState({allQuestions})
  }

  Next_Question = () => {
    const isLastQuestion = !this.state.allQuestions.filter((r) => r.idQuestion == this.state.currentQuestion + 1).length > 0
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
                  isCorrect = question.isValidated
                }
              })
              if (questionIndex == 0) {
                return (
                  question.isValidated !== undefined
                  ?
                  <div className='question_submit_box'>
                    <button className="btn_enabled" onClick={this.Next_Question}>Continuer</button>
                  </div>
                  :
                  <div className='question_submit_box'>
                    <button className={`${!this.state.isSubmitable ? 'btn_disabled' : 'btn_enabled'}`} style={{color: !this.state.isSubmitable ? '#737373' : '#fff'}} onClick={this.Question_Correction} disabled={!this.state.isSubmitable}>Valider mes réponses</button>
                  </div>
                )
              }
            })
          }
        </div>
        <div className='side_container'>
          <div className='side_title_box'>
            <h4>Question {this.state.currentQuestion + 1}/{this.state.allQuestions.length}</h4>
            <div className='side_icon'></div>
          </div>
        </div>
      </div>
    )
  }
}