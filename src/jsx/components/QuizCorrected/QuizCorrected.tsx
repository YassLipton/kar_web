import React from "react";

const alphabet = ['A', 'B', 'C', 'D']

const answersStyling = (choice: Choices) => {
  if (choice.selected) {
    if (choice.correct) {
      return 'selected_correct'
    } else {
      return 'selected_not_correct'
    }
  } else {
    if (choice.correct) {
      return 'not_selected_correct'
    } else {
      return 'not_selected_not_correct'
    }
  }
}

type Props = {
  allCorrectedQuestions: Question[]
  currentQuestion: number
}

type State = {
  allCorrectedQuestions: Question[]
  currentQuestion: number
  isSubmitable: boolean
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
  idQuestion: number
  choices: Array<Choices>
  img: string | undefined
  text: string
  isValidated?: boolean
  _idUser?: number
}

export default class QuizCorrected extends React.Component<Props, State> {
  state: State = {
    allCorrectedQuestions: this.props.allCorrectedQuestions,
    currentQuestion: this.props.currentQuestion,
    isSubmitable: false
  }

  componentDidMount() {
    console.log(this.props)
  }

  Previous_Question = () => {
    this.setState({
      currentQuestion: this.state.currentQuestion - 1
    })
  }

  Next_Question = () => {
    this.setState({
      currentQuestion: this.state.currentQuestion + 1
    })
  }

  Bottom_Buttons = () => {
    const isFirstQuestion = !(this.state.allCorrectedQuestions.filter((r) => r.idQuestion == this.state.currentQuestion - 1).length > 0)
    const isLastQuestion = !(this.state.allCorrectedQuestions.filter((r) => r.idQuestion == this.state.currentQuestion + 1).length > 0)
    return (
      <div></div>
    )
  }

  render() {
    return (
      <div className='question_container'>
        <div id='img'>
          {
            this.state.allCorrectedQuestions.filter((r) => r.idQuestion == this.state.currentQuestion).map((question, questionIndex) => {
              if (questionIndex == 0 && question.img) {
                return <img src={question.img} key={`img${questionIndex}`} />
              }
            })
          }
        </div>
        {
          this.state.allCorrectedQuestions.filter((r) => r.idQuestion == this.state.currentQuestion).map((question, questionIndex) => (
            <div className='question_box' key={`QI${questionIndex}`}>
              <span className='question_text'>{question.text}</span>
              <div className='answers_container'>
                {
                  question.choices.map((choice, choiceIndex) => (
                    <div className={`answers_box ${answersStyling(choice)}`} key={choiceIndex}>
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
    )
  }
}