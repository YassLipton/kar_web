import React, { useEffect, Suspense } from "react";

import { BrowserRouter as Router, Switch, Route, HashRouter } from "react-router-dom";

import './index.css'
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Quiz from "./components/Quiz";
import QuizResult from "./components/QuizResult";
import AppContainer from "./AppContainer";

class Markup extends React.Component {
  state = {
    userInfos: undefined
  }

  async componentDidMount() {
    if (window.location.hash != '#/signin') {
      const userToken = localStorage.getItem('userToken')
      const request = await fetch('http://192.168.1.26:3500/posts', {
        method: "GET",
        headers: {
          'authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const response = await request
      if (response.status == 401) {
        localStorage.removeItem('userToken')
        window.location.hash = '/signin'
        this.setState({userInfos: undefined})
      } else {
        const userInfos = await response.json()
        this.setState({userInfos})
      }
    }
  }

  render() {
    const routes = [
      { url: "", component: <Home userInfos={this.state.userInfos} /> },
      { url: "signin", component: <SignIn /> },
      { url: "quiz", component: <Quiz userInfos={this.state.userInfos} /> },
      { url: "result", component: <QuizResult userInfos={this.state.userInfos} /> },
    ];
  
    const loading = (
      <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
      </div>
    )
  
    return (
  
      <HashRouter>
        <Suspense fallback={loading}>
          <AppContainer>
            <Switch>
              {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} /> */}
              {routes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  //component={data.component}
                  render={() => data.component}
                />
              ))}
            </Switch>
          </AppContainer>
        </Suspense>
      </HashRouter>
  
    )
  }  
}

export default Markup;
