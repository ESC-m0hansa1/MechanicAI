import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import React,{useState} from "react"
import Sidebar from "./Components/Sidebar"; // Ensure component name is capitalized
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import Alert from './Components/Alert'

function App() {
  const [alert,setAlert] = useState(null);

  const showAlert = (message,type)=>{
    setAlert({
      message : message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null)
    },1200);
  }
  return (
    <>
      <BrowserRouter>
      <Alert alert = {alert}/>
        <Routes>
          <Route path="/home" element = {<Sidebar showAlert = {showAlert}/>}></Route>
          <Route path="/" element = {<Login showAlert = {showAlert}/>}></Route>
          <Route path="/signup" element = {<Signup showAlert = {showAlert}/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
