import React from 'react'
import { withRouter } from "react-router-dom"

class AppContainer extends React.Component {
  
  componentDidMount() {
    this.unlisten = this.props.history.listen(async (location, action) => {
      const userToken = localStorage.getItem('userToken')
      const request = await fetch('http://192.168.1.26:3500/posts', {
        method: "GET",
        headers: {
          'authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const response = await request
      console.log(response)
      if (response.status == 401) {
        localStorage.removeItem('userToken')
        window.location.hash = '/signin'
      }
    })
  }
  componentWillUnmount() {
      this.unlisten();
  }
  render() {
     return (
         <div>{this.props.children}</div>
      );
  }
}
export default withRouter(AppContainer)