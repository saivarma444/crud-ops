import { Component } from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Components/Login'
import Register from "./Components/Register"
import Home from "./Components/Home"
import UserDetails from "./Components/UserDetails";

class App extends Component{
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/details_form" element={<UserDetails/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App
