import {React , useState} from 'react'
import { useNavigate } from 'react-router-dom'

import "./Login.css"
export default function Login(props) {

    const {showAlert} = props;
    const [credentials,setcredentials] = useState({email:"",password:""})
    let history = useNavigate();
    const trigger = ()=>{
        history("/signup");
    }
    const submit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password}), 
          });
          const json = await response.json();
          // console.log(json);
          if(json.success)
            {
                localStorage.setItem('token',json.authtoken)
                showAlert("Logged in Successfully","success")
                history('/home')
            }
        else
        {
          showAlert("Invalid Details","danger")
        }
        };
        const onchange = (e) => {
            setcredentials({ ...credentials, [e.target.name]: e.target.value });
        
    }
  return (
    <div className="login">
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src={`${process.env.PUBLIC_URL}/chatbot2.png`} alt="chatbot"
                className="img-fluid" style={{height:'300px' , width:'329px' , borderRadius:'15px'}}/>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={submit}>
                <div className="form-outline mb-4">
                  <input type="email" id="form3Example3" className="form-control form-control-lg"
                    placeholder="Enter a valid email address"  name='email' onChange={onchange} value={credentials.email}/>
                  <label className="form-label" htmlFor="form3Example3">Email address</label>
                </div>

                <div className="form-outline mb-3">
                  <input type="password" id="form3Example4" className="form-control form-control-lg"
                    placeholder="Enter password" name='password' onChange={onchange} value={credentials.password}/>
                  <label className="form-label" htmlFor="form3Example4">Password</label>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" className="btn btn-primary btn-lg"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Login</button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a style={{cursor:'pointer'}} onClick={trigger}
                    className="link-danger">Register</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
