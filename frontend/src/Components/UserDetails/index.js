import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {v4 as uuidv4} from "uuid"
import {LabelName,LabelEmails,LabelLocation,LabelOccupation,LabelNumbers,Input,Container,Form,LoginButton,Select} from "./styledComponents"
import Cookies from 'js-cookie'
import './index.css'


const UserDetails = () => {
    const navigate = useNavigate()
    const [firstname,setFirstName] = useState("")
    const [lastname,setLastName] = useState("")
    const [email,setemail] = useState("")
    const [location,setLocation] = useState("")
    const [occupation,setOccupation] = useState("")
    const [number,setNumber] = useState("")
    const [gender,setGender] = useState("Male")
    const [errorMsg,setErrorMsg] = useState("")

    const getFirstName = event => {
        setFirstName(event.target.value)
    }

    const getLastName = event => {
        setLastName(event.target.value)
    }

    const getEmail = event =>{
        setemail(event.target.value)
    }

    const getLocation = event => {
        setLocation(event.target.value)
    }

    const getOccupation = event => {
        setOccupation(event.target.value)
    }

    const getNumber = event => {
        setNumber(event.target.value)
    }

    const getGender = event => {
        setGender(event.target.value)
    }

    const uploadTheData = async event => {
        event.preventDefault()
        const user_id = Cookies.get('user_id')
        const data = {
            id: uuidv4(),
            user_id: user_id
        }
    
        if (firstname && lastname) {
            data.username = `${firstname} ${lastname}`
        }
        if (email) {
            data.email = email
        }
        if (location) {
            data.location = location
        }
        if (occupation) {
            data.occupation = occupation
        }
        if (number) {
            data.number = number
        }
        if (gender) {
            data.gender = gender
        }
        const url = 'http://localhost:5000/user_input/'
        const options = {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url,options)
            const responseData = await response.json()
            setErrorMsg(responseData.message)
           if(responseData.message==="success"){
            navigate('/')
           }
    }

    console.log(errorMsg)
    

    return(
        <Container>
            <Form onSubmit={uploadTheData}>
                <LabelName htmlFor="firstNa">First Name</LabelName>
                <Input type="text" id="firstNa" placeholder='First Name'value={firstname} onChange={getFirstName}/>
                <LabelName htmlFor="lastNa">Last Name</LabelName>
                <Input type="text" id="lastNa" placeholder='Last Name'value={lastname} onChange={getLastName}/>
                <LabelEmails htmlFor="ema">Email</LabelEmails>
                <Input type="text" id="ema" placeholder='Email' value={email} onChange={getEmail}/>
                <LabelLocation htmlFor="locati">Location</LabelLocation>
                <Input type="text" id="locati" placeholder='Location' value={location} onChange={getLocation}/>
                <LabelOccupation htmlFor="occupati">Occupation</LabelOccupation>
                <Input type="text" id="occupati" placeholder='Occupation' value={occupation} onChange={getOccupation}/>
                <LabelNumbers htmlFor="num">Number</LabelNumbers>
                <Input type="number" id="num" placeholder='Number' value={number} onChange={getNumber}/>
                <LabelNumbers htmlFor='gen'>Gender</LabelNumbers>
                <Select id="gen" onChange={getGender}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>other</option>
                </Select>
                <LoginButton type="submit">Submit</LoginButton>
                <p className='error'>{errorMsg}</p>
            </Form>
        </Container>
    )
}

export default UserDetails