import { Component } from "react";
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'
import DisplayData  from "../DisplayData";
import {Nav,LoginButtons,LoginButton,LoginButtonAdd,Ul} from './styledComponents.js'
class Home extends Component{
    state = {moveBack:false,goTOAddSection:false,displayData:[]}

    componentDidMount(){
        this.getData()
    }


    getData = async () => {
        const username = Cookies.get('username')
        const encodeUserName = encodeURIComponent(username)
        console.log(encodeUserName)
        const url = `http://localhost:5000/user_data/?username=${encodeUserName}`
        const options = {
            method: "GET"
        }
        const response = await fetch(url,options)
        const responseData = await response.json()
        console.log(responseData.id)
        Cookies.set('user_id',responseData.id)
        this.setState({displayData:responseData.data})
    }

    moveToLogin = () => {
        Cookies.remove("jwt_token")
        Cookies.remove("username")
        Cookies.remove("user_id")
        this.setState({moveBack:true})
    }

    addNewData = () => {
        this.setState({goTOAddSection:true})
    }

    render(){
        const {moveBack,goTOAddSection,displayData} = this.state
        console.log(displayData)
        if(goTOAddSection){
            return <Navigate to='/details_form' replace/>
        }
        if(moveBack){
            return <Navigate to='/login' replace/> 
        }
        return(
           <>
            <Nav>
                <LoginButtons>
                    <LoginButton onClick={this.moveToLogin}>Logout</LoginButton>
                </LoginButtons>
            </Nav>
            <Ul>
                {displayData.map(each=>(
                    <DisplayData datas={each}  onDelete={this.getData} onUpdate={this.getData} key={each.id}/>
                ))}
            </Ul>
            <LoginButtons>
                <LoginButtonAdd onClick={this.addNewData}>Add</LoginButtonAdd>
            </LoginButtons>
           </>
        )
    }
}

export default Home