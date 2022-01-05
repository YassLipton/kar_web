import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom"
import QuizCorrected from "../QuizCorrected/QuizCorrected"
import QuizCorrection from './QuizCorrection'
import QuizCorrection2 from "./QuizCorrection2";

type Props = {
  userInfos?: UserInfos
}

type State = {
  correctedQuiz: CorrectedQuiz
  allCorrectedQuestions: Question[]
  currentQuiz?: number
  selectedQuestionsDisplay: 'correct' | 'wrong'
  currentQuestion: number
  isQuestionBoxOpen: boolean
  isNavDropdownOpen: boolean
}

type UserInfos = {
  id: string
  firstName: string
}

interface Quiz {
  idCorrectedQuiz: number
  correct: Array<{idQuestion: number}>
  wrong: Array<{idQuestion: number}>
  userToken?: number
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
  _idUser?: number
}

interface CorrectedQuiz {
  correct: Array<{idQuestion: number}>
  wrong: Array<{idQuestion: number}>
}

class QuizResult extends React.Component<RouteComponentProps & Props, State> {
  state: State = {
    correctedQuiz: {correct: [], wrong: []},
    allCorrectedQuestions: [],
    currentQuiz: undefined,
    selectedQuestionsDisplay: 'wrong',
    currentQuestion: 0,
    isQuestionBoxOpen: false,
    isNavDropdownOpen: false
  }

  componentDidMount() {
    const queryString = this.props.location.search
    const urlParams = new URLSearchParams(queryString)
    const idCorrectedQuiz = urlParams.get('idCorrectedQuiz')
    console.log(idCorrectedQuiz)
    if (idCorrectedQuiz != null) {
      this.All_Questions(parseInt(idCorrectedQuiz))
    } else {
      let correctedQuiz: CorrectedQuiz = {correct: [], wrong: []}
      let openRequest = indexedDB.open('quiz', 1)
      openRequest.onsuccess = (e) => {
        let db = openRequest.result
        let answersRequest = db.transaction(db.objectStoreNames).objectStore('answers').getAll()
        answersRequest.onsuccess = async () => {
          const answers: Array<Question[]> = await answersRequest.result
          if (answers.length > 0) {
            correctedQuiz = QuizCorrection(answers)
            this.setState({correctedQuiz})
            let allCorrectedQuestions: Question[] = []
            for (let i = 0; i < answers.length; i++) {
              for (let j = 0; j < answers[i].length; j++) {
                allCorrectedQuestions.push(answers[i][j])
              }
            }
            this.setState({allCorrectedQuestions})
          } else {
            window.location.hash = '/'
          }
          // Deleting answers from IDB
          // if (db.objectStoreNames.contains("answers")) {
          //   let transaction = db.transaction('answers', 'readwrite')
          //   transaction.objectStore("answers").clear()
          // }
        }
        db.close()
      }
    }
  }

  All_Questions = async (idCorrectedQuiz: number) => {
    if (!this.props.userInfos) {
      const userToken = localStorage.getItem('userToken')
      const request = await fetch('http://192.168.1.26:3500/posts', {
        method: "GET",
        headers: {
          'authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const responseJson = await request.json()
      let fet = await fetch('http://192.168.1.26:3500/all-corrected-questions', {
        method: "POST",
        body: JSON.stringify({
          _idUser: responseJson.id,
          idCorrectedQuiz: idCorrectedQuiz
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let rep = await fet.json()
      this.setState({allCorrectedQuestions: rep, correctedQuiz: QuizCorrection2(rep)})
      console.log(rep)
    } else {
      let fet = await fetch('http://192.168.1.26:3500/all-corrected-questions', {
        method: "POST",
        body: JSON.stringify({
          _idUser: this.props.userInfos?.id,
          idCorrectedQuiz: idCorrectedQuiz
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let rep = await fet.json()
      this.setState({allCorrectedQuestions: rep, correctedQuiz: QuizCorrection2(rep)})
      console.log(rep)
    }
  }

  Open_Corrected_Question = (idQuestion: number) => {
    this.setState({isQuestionBoxOpen: true, currentQuestion: idQuestion})
  }

  Logout = async () => {
    const userToken = localStorage.getItem('userToken')
    let fet = await fetch('http://192.168.1.26:3500/logout', {
      method: "POST",
      body: JSON.stringify({
        token: userToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let repStatus = await fet.status
    if (repStatus == 204) {
      localStorage.removeItem('userToken')
      window.location.hash = '/signin'
    }
  }

  render() {
    return (
      <>
        <nav>
          <div className='nav_items'>
            <div className='nav_links'>
              <div className='nav_link' onClick={() => window.location.hash = '/'}>
                <svg viewBox="0 0 506.426 506.426"><g><g><path d="m439.107 0h-371.788c-8.187 0-14.825 6.638-14.825 14.825v476.776c0 8.187 6.638 14.825 14.825 14.825h371.788c8.187 0 14.825-6.638 14.825-14.825v-476.776c-.001-8.187-6.638-14.825-14.825-14.825zm-72.894 476.776h-226.06v-447.127h226.06zm-284.069-447.127h28.36v447.127h-28.36zm342.138 447.127h-28.419v-447.127h28.419z"/><path d="m252.001 126.047c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/><path d="m252.001 233.759c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.189 6.638 14.825 14.825 14.825z"/><path d="m252.001 341.473c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/><path d="m252.001 449.186c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/></g></g></svg>
                <span>Code de la route</span>
              </div>
            </div>
            <div className='nav_profile'>
              <div className='nav_link' onClick={() => this.setState({isNavDropdownOpen: !this.state.isNavDropdownOpen})}>
                <span>{this.props.userInfos?.firstName}</span>
              </div>
              <div className='nav_dropdown' style={{display: this.state.isNavDropdownOpen ? 'block' : 'none'}}>
                <div className='nav_link' onClick={this.Logout}>
                  <span>Se déconnecter</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className='main_container'>
          <div className='header_result'>
            <h2>{this.state.correctedQuiz.wrong.length} fautes sur {this.state.correctedQuiz.wrong.length + this.state.correctedQuiz.correct.length}</h2>
            <span id='subtitle'>Entraînez-vous pour faire 5 fautes ou moins.</span>
            <div className="header_result_buttons">
              <button id='new' onClick={() => window.location.hash = '/quiz'}>Nouvelle série</button>
              <button id='restart' onClick={() => window.location.hash = `/quiz?idQuiz=${this.state.allCorrectedQuestions.length > 0 ? this.state.allCorrectedQuestions[0].idQuiz : 0}`}>Relancer</button>
            </div>
          </div>
            <div className='history_container'>
              <div className="history_container_header">
                <h4>Questions</h4>
                <div>
                  <span id={this.state.selectedQuestionsDisplay == 'wrong' ? 'active' : ''} onClick={() => this.setState({selectedQuestionsDisplay: 'wrong'})}>
                    <span>À revoir</span> ({this.state.correctedQuiz.wrong.length})
                  </span>
                  <span id={this.state.selectedQuestionsDisplay == 'correct' ? 'active' : ''} onClick={() => this.setState({selectedQuestionsDisplay: 'correct'})}>
                    <span>Réussis</span> ({this.state.correctedQuiz.correct.length})
                  </span>
                </div>
              </div>
              <div className='history_box_container'>
              {
                this.state.correctedQuiz[this.state.selectedQuestionsDisplay] && this.state.correctedQuiz[this.state.selectedQuestionsDisplay].map((quiz, quizIndex) => {
                  return (
                    <div className='history_box' id="result" key={quizIndex}>
                      <div className='history_box_left'>
                        <span id='mistakes'>Question {quiz.idQuestion + 1}</span>
                        <span id="cat">Série d'entraînement</span>
                      </div>
                      <div className='history_box_left'>
                        <a id="see_again" onClick={() => this.Open_Corrected_Question(quiz.idQuestion)}>Revoir</a>
                        <svg id="arrow" viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vectorEffect="none"/></g></svg>
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </div>
            <div className='goal_container'>
              <h4 style={{color: 'transparent'}}>Série pour progresser</h4>
              <div className='goal_box'>
              </div>
            </div>
            {this.state.isQuestionBoxOpen && this.state.allCorrectedQuestions.length > 0 ? 
              <div className="fullpage_background">
                <div className="corrected_question_box">
                  <div className="corrected_question_box_header">
                    <h4>Question {this.state.currentQuestion + 1}</h4>
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" onClick={() => this.setState({isQuestionBoxOpen: false})}><path d="m4.59 59.41a2 2 0 0 0 2.83 0l24.58-24.58 24.59 24.58a2 2 0 0 0 2.83-2.83l-24.59-24.58 24.58-24.59a2 2 0 0 0 -2.83-2.83l-24.58 24.59-24.59-24.58a2 2 0 0 0 -2.82 2.82l24.58 24.59-24.58 24.59a2 2 0 0 0 0 2.82z"/></svg>
                  </div>
                  <QuizCorrected allCorrectedQuestions={this.state.allCorrectedQuestions} currentQuestion={this.state.currentQuestion} />
                  <div className="corrected_question_box_header">
                    <h4 style={{color: 'transparent'}}>Question 1</h4>
                  </div>
                </div>
              </div> 
            : undefined}
        </div>
      </>
      )
  }
}

export default withRouter(QuizResult)