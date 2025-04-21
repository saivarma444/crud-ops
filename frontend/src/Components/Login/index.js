import { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Cookies from "js-cookie"
import { IoMdEye } from "react-icons/io"
import { IoIosEyeOff } from "react-icons/io"
import { GoogleLogin } from '@react-oauth/google'
import {jwtDecode} from "jwt-decode"
import { Label, Input, Container, Form, LoginButton, InputPassword, SeeButton } from "./styledComponents"
import './index.css'

class Login extends Component {
  state = {
    username: "",
    password: "",
    errorMsg: "",
    isShowns: false,
    shouldRedirect: false
  }

  getUserNameLogin = event => {
    this.setState({ username: event.target.value })
  }

  getPasswordLogin = event => {
    this.setState({ password: event.target.value })
  }

  changevalueLogin = event => {
    event.preventDefault()
    this.setState(prev => ({
      isShowns: !prev.isShowns
    }))
  }

  submitDataLogin = async event => {
    event.preventDefault()
    const { username, password } = this.state

    const userCredentials = { username, password }
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCredentials)
    }

    const url = "http://localhost:5000/login/"
    const response = await fetch(url, options)

    if (response.ok === true) {
      const responseData = await response.json()
      if (responseData.message === "success") {
        Cookies.set("jwt_token", responseData.token, { expires: 7 })
        Cookies.set("username", username)
        this.setState({ shouldRedirect: true })
      } else {
        this.setState({ errorMsg: responseData.message })
      }
    }
  }

  handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse
      const decoded = jwtDecode(credential)
      const { email } = decoded
      console.log("Google email:", email)

      const res = await fetch("http://localhost:5000/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      console.log(data)
      if (data.message === "success") {
        Cookies.set("jwt_token", data.token, { expires: 7 })
        Cookies.set("username", data.username, {expires:7})
        Cookies.set("email", email, {expires:7})
        this.setState({ shouldRedirect: true })
      } else {
        this.setState({ errorMsg: data.message })
      }
    } catch (error) {
      console.error("Google Sign-In Error", error)
      this.setState({ errorMsg: "Google Sign-In Failed" })
    }
  }

  render() {
    const { username, isShowns, errorMsg, shouldRedirect } = this.state
    if (shouldRedirect) {
      return <Navigate to="/" replace />
    }

    return (
      <Container>
        <Form onSubmit={this.submitDataLogin}>
          <Label htmlFor="username">USERNAME</Label>
          <Input
            type="text"
            value={username}
            placeholder='Username'
            id="username"
            onChange={this.getUserNameLogin}
          />
          <Label htmlFor="password">PASSWORD</Label>
          <div>
            <InputPassword
              type={isShowns ? "text" : "password"}
              placeholder='Password'
              id="password"
              onChange={this.getPasswordLogin}
            />
            <SeeButton onClick={this.changevalueLogin}>
              {isShowns ? <IoIosEyeOff className="sizeTheIcon" /> : <IoMdEye className="sizeTheIcon" />}
            </SeeButton>
          </div>
          <LoginButton type="submit">Login</LoginButton>
          <p className="error">{errorMsg}</p>
          <Link to="/register">Register here</Link>

          <br /><br />
          <GoogleLogin
            onSuccess={this.handleGoogleSuccess}
            onError={() => this.setState({ errorMsg: "Google Sign-In failed" })}
          />
        </Form>
      </Container>
    )
  }
}

export default Login
