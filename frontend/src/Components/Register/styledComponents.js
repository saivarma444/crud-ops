import styled from 'styled-components'

export const Label = styled.label`
    font-family: "Arial";
    padding-bottom: 10px;
    font-weight:600;
    font-size:18px;
    color: #4c4e4f;
    text-align:left;
    margin-right: 200px;
`

export const Input = styled.input`
    font-family:"Arial";
    margin-bottom: 32px;
    font-weight:600;
    height: 30px;
    width: 300px;
    border-radius: 6px;
    border-width:1px;
`
export const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color:#edf2ef;
`
export const LabelEmail= styled.label`
    font-family: "Arial";
    padding-bottom: 10px;
    font-weight:600;
    font-size:18px;
    color: #4c4e4f;
    text-align:left;
    margin-right: 250px;
`

export const LabelNumber = styled.label`
    font-family: "Arial";
    padding-bottom: 10px;
    font-weight:600;
    font-size:18px;
    color: #4c4e4f;
    text-align:left;
    margin-right: 150px;
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    height: 70%;
    width:30%;
    border-radius:6px;
    background-color:#ffffff;
    
`

export const LoginButton = styled.button`
    height:40px;
    width:300px;
    border-width:0px;
    border-radius:6px;
    background-color: #2587d9;
    margin-top:26px;
`

export const InputPassword = styled.input`
    font-family:"Arial";
    margin-bottom: 16px;
    font-weight:600;
    height: 30px;
    width: 260px;
    border-top-left-radius:6px;
    border-bottom-left-radius:6px;
    border-width:1px;
    border-right:none;
`

export const SeeButton = styled.button`
    border-left:none;
    background-color:transparent;
    height:34px;
    border-top-right-radius:6px;
    border-bottom-right-radius:6px;
    border-width:1px;
    align-self:center;
    positon:absolute;
    transform:translateY(+11%)
`