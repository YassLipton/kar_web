import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      percentage: 25,
      correctQuizList: [],
      historyLoaded: false
    }
  }

  componentDidMount() {
    this.List_Corrected_Quiz()
  }

  List_Corrected_Quiz = async () => {
    let fet = await fetch('http://192.168.1.26:3500/home-corrected-quiz-list', {
      method: "POST",
      body: JSON.stringify({
        idUser: this.props.userToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let rep = await fet.json()
    console.log(rep)
    this.setState({correctQuizList: rep, historyLoaded: true})
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
                <div className='nav_link'>
                  <span>Name</span>
                </div>
              </div>
            </div>
          </nav>
          <div className='main_container'>
            <div className='series_container'>
              <h4>Séries de code</h4>
              <div className='series_box_container'>
                <div className='series_box'>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Entraînement</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" isolation="auto" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vector-effect="none"/></g></svg>
                    </div>
                    <span>40 questions avec correction</span>
                  </div>
                </div>
                <div className='series_box'>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Série thématique</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" isolation="auto" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vector-effect="none"/></g></svg>
                    </div>
                    <span style={{color: '#d44148'}}>10 thèmes à travailler</span>
                  </div>
                </div>
                <div className='series_box'>
                  <div className='series_box_icon'></div>
                  <div className='series_box_links'>
                    <div className='series_box_title'>
                      <span id="title">Examen blanc</span>
                      <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" isolation="auto" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vector-effect="none"/></g></svg>
                    </div>
                    <span>40 questions sans correction</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='history_container'>
              <h4>Dernières séries</h4>
              <div className='history_box_container'>
            {
              this.state.correctQuizList.map((quiz, quizIndex) => {
                return (
                  <div className='history_box'>
                    <div className='history_box_left'>
                      <div className='history_box_icon'></div>
                      <span id='mistakes'>{quiz.wrong.length} fautes sur {quiz.wrong.length + quiz.correct.length}</span>
                        <svg viewBox="0 0 6.3499999 6.3500002"><g id="layer1" transform="translate(0 -290.65)"><path id="path9429" d="m2.2580394 291.96502a.26460982.26460982 0 0 0 -.1741496.46871l1.6190225 1.38699-1.6190225 1.38648a.26460982.26460982 0 1 0 .3436483.40049l1.8536335-1.58595a.26460982.26460982 0 0 0 0-.40256l-1.8536335-1.5875a.26460982.26460982 0 0 0 -.1694987-.0667z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-feature-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" isolation="auto" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vector-effect="none"/></g></svg>
                      <span>Série d'entraînement</span>
                    </div>
                    <a>Relancer</a>
                  </div>
                )
              })
            }
                <a id='show_more'>Voir plus</a>
              </div>
            </div>
            <div className='goal_container'>
              <h4>Objectifs</h4>
              <div className='goal_box'>
                <div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style={{'--value': this.state.percentage / 2}}>
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