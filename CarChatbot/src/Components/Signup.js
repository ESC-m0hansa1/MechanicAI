import React,{useState} from 'react';
import {useNavigate} from "react-router-dom"

export default function Signup(props) {
  const [credentials,setcredentials] = useState({name:"",email:"",password:"",cpassword:""})
  const {showAlert} = props;
  const {name,email,password} = {credentials}
    let history = useNavigate();
    const submit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/auth/createuser", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),

          });
          const json = await response.json();
          // console.log(json);
          if(json.success)
            {
                localStorage.setItem('token',json.authtoken)
                history('/home')
                showAlert("Account Created Successfully","success")
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
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="container text-center" style={{border:'2px solid #333333', borderRadius:'25px',padding:'20px'}}>
        <h2 className="mb-4">Signup</h2>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              style={{width:'50%', marginLeft:'22vw'}}
              aria-describedby="nameHelp"
              onChange={onchange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              style={{width:'50%', marginLeft:'22vw'}}
              name="email"
              aria-describedby="emailHelp"
              onChange={onchange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              style={{width:'50%', marginLeft:'22vw'}}
              name="password"
              required
              onChange={onchange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="cpassword"
              style={{width:'50%', marginLeft:'22vw'}}
              name="cpassword"
              required
              onChange={onchange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
