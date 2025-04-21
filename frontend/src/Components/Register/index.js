import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import { Navigate } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {GoogleLogin} from "@react-oauth/google"
import {Label,Input,Container,Form,LoginButton,Select, SeeButton,InputPassword,LabelEmail,LabelNumber} from "./styledComponents"

class Register extends Component{
    state = {username:"",password:"",email:"",number:"",errMsg:"",isShown:false,shouldRedirect:false }


    changevalueLogin = (event) => {
        event.preventDefault()
        this.setState((prev)=>({
            isShown:!prev.isShown
        }))
    }


    getUserName = (event) => {
        this.setState({username:event.target.value})
    }

    getPassword = (event) => {
        this.setState({password:event.target.value})
    }

    getEmail = event => {
        this.setState({email:event.target.value})
    }

    getNumber = event => {
        this.setState({number:event.target.value})
    }

    redirectToGoogle = () => {
        window.location.href = "http://localhost:5000/auth/google"
        this.setState({shouldRedirect:true})
    }

    submitData = async event => {
        event.preventDefault()
        const {username,password,email,number} = this.state
        console.log(typeof(username))
        if(!username){
            this.setState({errorMsg:"Please enter a username"})
        }else if(!password){
            this.setState({errorMsg:"Please enter a password"})
        }else if(!email){
            this.setState({errorMsg:"Please enter a email"})
        }else if(!number){
            this.setState({errorMsg:"Please enter a number"})
        }else{
        const opdata = {
            id: uuidv4(),
            "username":username,
            "password":password,
            "email":email,
            "number":number
        }
    
        
        console.log("Password being sent to backend:", password);

        const url = "http://localhost:5000/register/"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(opdata)
        }
        const respone = await fetch(url,options)
        console.log(respone)
        if(respone.ok===true){
            const responseData = await respone.json()
            console.log(responseData)
            if(responseData.message==="success"){
                this.setState({errorMsg:"",shouldRedirect:true})   
            }else{
                this.setState({errorMsg:responseData.message})
            }
        }
        
     }
    }
    render(){
        const {username,email,number,errorMsg,isShown,shouldRedirect} = this.state

        if(shouldRedirect){
            return <Navigate to="/login" replace/>
        }

        return(
            <Container>
                <Form onSubmit={this.submitData}>
                    <Label htmlFor="username">USERNAME</Label>
                    <Input type="text" value={username} placeholder='Username should be 14 characters' id="username" onChange={this.getUserName}/>
                    <Label htmlFor="password">PASSWORD</Label>
                    <div>
                        <InputPassword type={isShown===true ? "text" : "password"}  placeholder=' Password' id="password" onChange={this.getPassword}/>
                        <SeeButton onClick={this.changevalueLogin}>
                            {isShown===true ? <IoIosEyeOff className="sizeTheIcon"/> : <IoMdEye className="sizeTheIcon"/>}
                        </SeeButton>
                    </div>
                    <LabelEmail htmlFor="emailer">EMAIL</LabelEmail>
                    <Input type="text" value={email} placeholder='Email' id="emailer" onChange={this.getEmail}/>
                    <LabelNumber htmlFor="numberer">MOBILE NUMBER</LabelNumber>
                    <Input type="number" value={number} placeholder='Mobile Number' id="numberer" onChange={this.getNumber}/>
                    <LoginButton type="submit">Submit</LoginButton>
                    <p className='error'>{errorMsg}</p>
                    <GoogleLogin
                        onSuccess={this.redirectToGoogle}
                        onError={()=>alert("google sign-up failed")}
                    />
                </Form>
            </Container>
        )
    }
}

export default Register
