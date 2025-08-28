import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {addUser} from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  
  const login = async ()=>{
    try{
      const res = await axios.post(BASE_URL+'/login',{
      emailId,
      password
      },{withCredentials:true})

      dispatch(addUser(res.data));
      
      navigate('/feed');
      
    }catch(err){
      setError(err?.response?.data || "Try again")
      console.log(err);
    }  
  }
  const signup = async ()=>{
      try{
        const res = await axios.post(BASE_URL+"/signup", {firstName, lastName, emailId, password},
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
          </>
          }
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

export default Login