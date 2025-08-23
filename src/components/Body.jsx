import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { useSelector, useDispatch } from 'react-redux'
import {addUser} from  '../utils/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userData = useSelector((store)=>{
    return store.user;
  }) 

  const fetchData = async ()=>{
    if(userData) return;
    try{
      const res = await axios.get(BASE_URL+"/profile",{
        withCredentials:true
      })
      dispatch(addUser(res.data));
    }catch(err){
      if(err.response && err.response.status  === 401){
        navigate('/login');
      }else{
        console.log(err);
      }
      
    };
  }
  useEffect(()=>{
      fetchData();
    },[])
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Body