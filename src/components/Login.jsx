import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import Navbar from './Navbar'
// import Feed from './Feed'

const LoginComp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [student, setStudent] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState("")
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  
  const login = async ()=>{
    try{
      const res = await axios.post(BASE_URL+'/login',{
      emailId,
      password
      },{withCredentials:true})
      const nextRoute = res?.data?.data?.nextRoute;
      navigate(nextRoute);
      
    }catch(err){
      setError(err?.response?.data || "Try again")
      console.log(err);
    }  
  }
  const signup = async ()=>{
      try{
        const res = await axios.post(BASE_URL+"/signup", {firstName, lastName, emailId, password,phone, location, role, student},
        {withCredentials:true}
      )
      setIsLoginForm(true);
      setError("");
      }catch(err){
        setError(err?.response?.data || "Try again")
        console.log(err);
      }
      
    }
  return (
    <div className = "flex ietms-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl mt-5">
        <div className="card-body">
         <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Id</legend>
            <input value = {emailId} onChange={(e)=>{
              setEmailId(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input value = {password} onChange={(e)=>{
              setPassword(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
         {!isLoginForm && 
         <> 
         <fieldset className="fieldset">
            <legend className="fieldset-legend">First Name</legend>
            <input value = {firstName} onChange={(e)=>{
              setFirstName(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name</legend>
            <input value = {lastName} onChange={(e)=>{
              setLastName(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Phone</legend>
            <input value = {phone} onChange={(e)=>{
              setPhone(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Student</legend>
            <select value={student} onChange={e => setStudent(e.target.value)} className="input">
              <option value="">Are you a student?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Role</legend>
            <select value={role} onChange={e => setRole(e.target.value)} className="input">
              <option value="">Select role</option>
              <option value="supplier">Supplier</option>
              <option value="participant">Participant</option>
              <option value="non-profit">Non-profit</option>
              <option value="sponsor">Sponsor</option>
              <option value="doctor">Doctor</option>
            </select>
          </fieldset>
          
          <fieldset className="fieldset">
            <legend className="fieldset-legend">location</legend>
            <input value = {location} onChange={(e)=>{
              setLocation(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          </>
          }
          <p className="text-red-500">{error}</p>
          <div className="m-auto card-actions justify-end">
            <button onClick = {isLoginForm ? login :signup} className="btn btn-primary">{ isLoginForm ? "Login" :"Signup" }</button>
          </div>
          <p className= "m-auto" onClick = {()=>{setIsLoginForm(!isLoginForm)}}>{isLoginForm? "new User? Register here": "Login here"}</p>
        </div>
      </div>

    </div>
  )
}

const Login = () =>{
  return(
    <>
    <Navbar/>
    <LoginComp/>
    </>
  )
}

export default Login  