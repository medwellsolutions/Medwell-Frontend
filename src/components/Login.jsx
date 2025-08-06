import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {addUser} from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
const Login = () => {
  const [emailId, setEmailId] = useState("pranaisaireddy@gmail.com");
  const [password, setPassword] = useState("Pranai123@");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-end">
            
            <button onClick = {login} className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login