import {Component} from 'react'
import {Link,Navigate} from 'react-router-dom'
import Cookies from "js-cookie"
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {Label,Input,Container,Form,LoginButton,InputPassword,SeeButton} from "./styledComponents"
import './index.css'

class Login extends Component{
    state = {username:"",password:"",errorMsg:"",isShowns:false,shouldRedirect:false}

    getUserNameLogin = event => {
        this.setState({username:event.target.value})
    }

    getPasswordLogin = event => {
        this.setState({password:event.target.value})
    }
    changevalueLogin = (event) => {
        event.preventDefault()
        this.setState((prev)=>({ 
            isShowns:!prev.isShowns
        }))
    }

    submitDataLogin = async event => {
        event.preventDefault()
        const {username,password} = this.state
        const userCredentials = {}
        if (username) {
            userCredentials.username = username
        }
    
        if (password) {
            userCredentials.password = password
        }
        console.log(userCredentials)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userCredentials)
        }
        const url  = "http://localhost:5000/login/"
        const response = await fetch(url,options)
        if(response.ok===true){
            const responseData = await response.json()
            if(responseData.message==="success"){
                this.setState({shouldRedirect:true})
                Cookies.set("jwt_token",responseData.token,{expires:7})
                Cookies.set("username",username)
            }else{
                this.setState({errorMsg:responseData.message})
            }
        }
    }

    render(){
        const {username,isShowns,errorMsg,shouldRedirect} = this.state
        if(shouldRedirect){
            return <Navigate to="/" replace/>
        }
        return(
            <Container>
                <Form onSubmit={this.submitDataLogin}>
                    <Label htmlFor="username">USERNAME</Label>
                    <Input type="text" value={username} placeholder=' Username' id="username" onChange={this.getUserNameLogin}/>
                    <Label htmlFor="password">PASSWORD</Label>
                    <div>
                    <InputPassword type={isShowns===true ? "text" : "password"}  placeholder=' Password' id="password" onChange={this.getPasswordLogin}/>
                    <SeeButton onClick={this.changevalueLogin}>
                        {isShowns===true ? <IoIosEyeOff className="sizeTheIcon"/> : <IoMdEye className="sizeTheIcon"/>}
                    </SeeButton>
                    </div>
                    <LoginButton type="submit">Login</LoginButton>
                    <p className="error">{errorMsg}</p>
                    <Link to="/register">Register here</Link>
                </Form>
            </Container>
        )
    }
}

export default Login