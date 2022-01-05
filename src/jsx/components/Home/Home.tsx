import React from "react";
import { Link } from "react-router-dom"

type Props = {
  userInfos?: UserInfos
}

type State = {
  percentage: number
  correctQuizList: Array<Quiz>
  historyLoaded: boolean
  isNavDropdownOpen: boolean
}

type UserInfos = {
  id: string
  firstName: string
}

interface Quiz {
  idQuiz: number
  idCorrectedQuiz: number
  correct: Array<{idQuestion: number}>
  wrong: Array<{idQuestion: number}>
}

export default class Home extends React.Component<Props, State> {
  state: State = {
    percentage: 25,
    correctQuizList: [],
    historyLoaded: false,
    isNavDropdownOpen: false
  }

  componentDidMount() {
    this.List_Corrected_Quiz()
    const userToken = localStorage.getItem('userToken')
    console.log(userToken)
  }

  List_Corrected_Quiz = async () => {
    const userToken = localStorage.getItem('userToken')
    let fet = await fetch('http://192.168.1.26:3500/corrected-quiz-list/3', {
      method: "GET",
      headers: {
        'authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    let rep: Quiz[] = await fet.json()
    console.log(rep)
    this.setState({correctQuizList: rep, historyLoaded: true})
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
    if (this.state.historyLoaded) {
      return (
        <>
          <nav>
            <div className='nav_items'>
              <div className='nav_links'>
                <div className='nav_link active'>
                  <svg viewBox="0 0 506.426 506.426"><g><g><path d="m439.107 0h-371.788c-8.187 0-14.825 6.638-14.825 14.825v476.776c0 8.187 6.638 14.825 14.825 14.825h371.788c8.187 0 14.825-6.638 14.825-14.825v-476.776c-.001-8.187-6.638-14.825-14.825-14.825zm-72.894 476.776h-226.06v-447.127h226.06zm-284.069-447.127h28.36v447.127h-28.36zm342.138 447.127h-28.419v-447.127h28.419z"/><path d="m252.001 126.047c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/><path d="m252.001 233.759c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.189 6.638 14.825 14.825 14.825z"/><path d="m252.001 341.473c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/><path d="m252.001 449.186c8.187 0 14.825-6.638 14.825-14.825v-42.787c0-8.187-6.638-14.825-14.825-14.825s-14.825 6.638-14.825 14.825v42.787c0 8.187 6.638 14.825 14.825 14.825z"/></g></g></svg>
                  <span>Code de la route</span>
                </div>
              </div>
              <div className='nav_profile'>
                <div className='nav_link' onClick={() => this.setState({isNavDropdownOpen: !this.state.isNavDropdownOpen})}>
                  <span>{this.props.userInfos?.firstName}</span>
                </div>
              </div>
              <div className='nav_dropdown' style={{display: this.state.isNavDropdownOpen ? 'block' : 'none'}}>
                <div className='nav_link' onClick={this.Logout}>
                  <span>Se déconnecter</span>
                </div>
              </div>
            </div>
          </nav>
          <div className='main_container'>
            <div className='series_container'>
              <h4>Séries de code</h4>
              <div className='series_box_container'>
                <div className='series_box' onClick={() => window.location.hash = '/quiz'}>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Entraînement</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vectorEffect="none"/></g></svg>
                    </div>
                    <span>5 questions avec correction</span>
                  </div>
                </div>
                <div className='series_box'>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Série thématique</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vectorEffect="none"/></g></svg>
                    </div>
                    <span style={{color: '#d44148'}}>10 thèmes à travailler</span>
                  </div>
                </div>
                <div className='series_box'>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Examen blanc</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vectorEffect="none"/></g></svg>
                    </div>
                    <span>40 questions sans correction</span>
                  </div>
                </div>
              </div>
            </div>
            {
              this.state.correctQuizList.length > 0
              ?
              <div className='history_container'>
                <h4>Dernières séries</h4>
                <div className='history_box_container'>
              {
                this.state.correctQuizList.length > 0 && this.state.correctQuizList.map((quiz, quizIndex) => {
                  return (
                    <div className='history_box' key={quizIndex}>
                      <div className='history_box_left'>
                        <div className='history_box_icon'></div>
                        <span id='mistakes' onClick={() => window.location.hash = `/result?idCorrectedQuiz=${quiz.idCorrectedQuiz}`}>{quiz.wrong.length} fautes sur {quiz.wrong.length + quiz.correct.length}</span>
                        <svg id="arrow" viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vectorEffect="none"/></g></svg>
                        <span>Série d'entraînement</span>
                      </div>
                      {/* <Link to={{pathname: '/result', state: {miam: 'ooo'}}}>Relancer</Link> */}
                      <a onClick={() => window.location.hash = `/quiz?idQuiz=${quiz.idQuiz}`}>Relancer</a>
                    </div>
                  )
                })
              }
                <a id='show_more'>Voir plus</a>
                </div>
              </div>
              :
              <div className='history_container'>
                <h1 style={{color: 'gray', marginTop: 30}}>Aucune série réalisée pour le moment</h1>
              </div>
            }
            <div className='goal_container'>
              <h4>Objectifs</h4>
              <div className='goal_box'>
                <div role="progressbar" aria-valuenow={65} aria-valuemin={0} aria-valuemax={100} style={{['--value' as any]: this.state.percentage / 2}}>
                  <div id='hidder'></div>
                </div>
              </div>
            </div>
          </div>
        </>
        )
    } else {
      return <p>Loading...</p>
    }
  }
}