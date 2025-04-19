import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { FaTrashAlt } from "react-icons/fa";
import {Li,EditButton,DeleteButton,DIV} from './styledComponents'
import './index.css'

const DisplayData = ({ datas, onDelete, onUpdate }) => {
    const { id, username, email, location, gender, occupation, number } = datas;
    const [isChanged, setChange] = useState(false);

    
    const [usernames, setFirstName] = useState(username);
    const [emails, setEmail] = useState(email);
    const [locations, setLocation] = useState(location);
    const [occupations, setOccupation] = useState(occupation);
    const [numbers, setNumber] = useState(number);
    const [genders, setGender] = useState(gender);

    
    const editTheData = () => {
        setChange(true);
    };


    useEffect(() => {
        setFirstName(username);
        setEmail(email);
        setLocation(location);
        setOccupation(occupation);
        setNumber(number);
        setGender(gender);
    }, [username, email, location, occupation, number, gender]);

    
    const uploadTheDatas = async (event) => {
        event.preventDefault();
        const user_id = Cookies.get('user_id');
        const url = "http://localhost:5000/update/";
        const newData = {
            id,
            user_id,
            username: usernames,
            email: emails,
            location: locations,
            gender: genders,
            occupation: occupations,
            number: numbers
        };
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData)
        };
        const response = await fetch(url, options);
        console.log(response)
        if(response.ok===true){
            const responseData = await response.json()
            if(responseData.message==="success"){
                setChange(false)
                onUpdate()
            }
        }
        
    };


    const deleteTheData = async () => {
        const url = `http://localhost:5000/delete/${id}`;
        const options = { method: "DELETE" };
        await fetch(url, options);
        onDelete();
    };

    
    const renderData = () => {
        if (isChanged===false) {
            return (
                <Li>
                    <DIV>
                        <h3>Username</h3>
                        <DeleteButton onClick={deleteTheData}><FaTrashAlt className='size'/></DeleteButton>
                    </DIV>
                    <p>{username}</p>
                    <h3>Email</h3>
                    <p>{email}</p>
                    <h3>Location</h3>
                    <p>{location}</p>
                    <h3>Gender</h3>
                    <p>{gender}</p>
                    <h3>Occupation</h3>
                    <p>{occupation}</p>
                    <h3>Number</h3>
                    <p>{number}</p>
                    <div className='end'>
                        <EditButton onClick={editTheData}>Edit</EditButton>
                    </div>
                </Li>
            );
        } else {
            return (
                <form onSubmit={uploadTheDatas}>
                    <label htmlFor="firstNam">Username</label>
                    <input type="text" id="firstNam" value={usernames} onChange={(e) => setFirstName(e.target.value)} />
                    <label htmlFor="emai">Email</label>
                    <input type="text" id="emai" value={emails} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="locatio">Location</label>
                    <input type="text" id="locatio" value={locations} onChange={(e) => setLocation(e.target.value)} />
                    <label htmlFor="occupatio">Occupation</label>
                    <input type="text" id="occupatio" value={occupations} onChange={(e) => setOccupation(e.target.value)} />
                    <label htmlFor="numbe">Number</label>
                    <input type="number" id="numbe" value={numbers} onChange={(e) => setNumber(e.target.value)} />
                    <label htmlFor="gende">Gender</label>
                    <input type="text" id="gende" value={genders} onChange={(e) => setGender(e.target.value)} />
                    <EditButton type="submit">Update</EditButton>
                </form>
            );
        }
    };

    return <>{renderData()}</>;
};

export default DisplayData;
