import React from "react";

type Props = {}

type State = {
  email: string
  password: string
  isPasswordVisible: boolean
  isFormSubmitable: boolean
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

export default class SignIn extends React.Component<Props, State> {
  state: State = {
    email: '',
    password: '',
    isPasswordVisible: false,
    isFormSubmitable: false
  }

  componentDidMount() {}

  Email_Input_Handler = (value: string) => {
    this.setState({email: value})
    if (value.length > 0 && this.state.password.length > 0 && !this.state.isFormSubmitable) {
      this.setState({isFormSubmitable: true})
    } else if (value.length == 0 && this.state.password.length == 0 && this.state.isFormSubmitable) {
      this.setState({isFormSubmitable: false})
    }
  }

  Password_Input_Handler = (value: string) => {
    this.setState({password: value})
    if (value.length > 0 && this.state.email.length > 0 && !this.state.isFormSubmitable) {
      this.setState({isFormSubmitable: true})
    } else if (value.length == 0 && this.state.email.length == 0 && this.state.isFormSubmitable) {
      this.setState({isFormSubmitable: false})
    }
  }

  Change_Password_Visibility = () => {
    this.setState({isPasswordVisible: !this.state.isPasswordVisible})
  }

  Submit = async () => {
    let fet = await fetch('http://192.168.1.26:3500/login', {
      method: "POST",
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let rep = await fet.json()
    console.log(rep)
    if (rep.successfullyLogged) {
      localStorage.setItem('userToken', rep.accessToken)
      window.location.href = window.location.origin
    }
  }

  render() {
    return (
      <div className="signin_container">
        <div className="signin_box">
          <h4 className="signin_box_title">Je me connecte</h4>
          <form name="loginForm" onSubmit={(e) => {
            e.preventDefault()
            if (this.state.isFormSubmitable) this.Submit()
          }}>
            <div className="signin_box_form">
              <div className="signin_box_form_group">
                <label>Adresse email</label>
                <input id="email" type="email" placeholder="michael@knight.com" onChange={(e) => this.Email_Input_Handler(e.target.value)}/>
              </div>
              <div className="signin_box_form_group">
                <label>Mot de passe</label>
                <div className="form_group_w_asset">
                  <input id="password" type={!this.state.isPasswordVisible ? 'password' : 'text'} onChange={(e) => this.Password_Input_Handler(e.target.value)} />
                {
                  this.state.isPasswordVisible
                  ?
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.871 477.871" onClick={this.Change_Password_Visibility}><g><g><path d="M474.609,228.901c-29.006-38.002-63.843-71.175-103.219-98.287l67.345-67.345c6.78-6.548,6.968-17.352,0.42-24.132c-6.548-6.78-17.352-6.968-24.132-0.42c-0.142,0.137-0.282,0.277-0.42,0.42l-73.574,73.506c-31.317-17.236-66.353-26.607-102.093-27.307C109.229,85.336,7.529,223.03,3.262,228.9c-4.349,5.983-4.349,14.087,0,20.07c29.006,38.002,63.843,71.175,103.219,98.287l-67.345,67.345c-6.78,6.548-6.968,17.352-0.42,24.132c6.548,6.78,17.352,6.968,24.132,0.42c0.142-0.137,0.282-0.277,0.42-0.42l73.574-73.506c31.317,17.236,66.353,26.607,102.093,27.307c129.707,0,231.407-137.694,235.674-143.565C478.959,242.988,478.959,234.884,474.609,228.901z M131.296,322.494c-34.767-23.156-65.931-51.311-92.484-83.558c25.122-30.43,106.598-119.467,200.124-119.467c26.609,0.538,52.77,6.949,76.612,18.773L285.92,167.87c-39.2-26.025-92.076-15.345-118.101,23.855c-18.958,28.555-18.958,65.691,0,94.246L131.296,322.494z M285.016,217.005c3.34,6.83,5.091,14.328,5.12,21.931c0,28.277-22.923,51.2-51.2,51.2c-7.603-0.029-15.101-1.78-21.931-5.12L285.016,217.005z M192.856,260.866c-3.34-6.83-5.091-14.328-5.12-21.931c0-28.277,22.923-51.2,51.2-51.2c7.603,0.029,15.101,1.78,21.931,5.12L192.856,260.866z M238.936,358.402c-26.609-0.538-52.769-6.949-76.612-18.773l29.628-29.628c39.2,26.025,92.076,15.345,118.101-23.855c18.958-28.555,18.958-65.691,0-94.246l36.523-36.523c34.767,23.156,65.931,51.312,92.484,83.558C413.937,269.366,332.461,358.402,238.936,358.402z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999" onClick={this.Change_Password_Visibility}><g><g><path d="M508.745,246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818,239.784,3.249,246.035c-4.332,5.936-4.332,13.987,0,19.923c4.569,6.257,113.557,153.206,252.748,153.206s248.174-146.95,252.748-153.201C513.083,260.028,513.083,251.971,508.745,246.041z M255.997,385.406c-102.529,0-191.33-97.533-217.617-129.418c26.253-31.913,114.868-129.395,217.617-129.395c102.524,0,191.319,97.516,217.617,129.418C447.361,287.923,358.746,385.406,255.997,385.406z"/></g></g><g><g><path d="M255.997,154.725c-55.842,0-101.275,45.433-101.275,101.275s45.433,101.275,101.275,101.275s101.275-45.433,101.275-101.275S311.839,154.725,255.997,154.725z M255.997,323.516c-37.23,0-67.516-30.287-67.516-67.516s30.287-67.516,67.516-67.516s67.516,30.287,67.516,67.516S293.227,323.516,255.997,323.516z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                }
                </div>
              </div>
              <div className="signin_box_form_group">
                <button className={this.state.isFormSubmitable ? 'btn_submitable' : undefined} disabled={!this.state.isFormSubmitable}>Je me connecte</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      )
  }
}