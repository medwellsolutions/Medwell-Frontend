import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useSelector, useDispatch } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import { useEffect } from 'react';
import UserCard from './UserCard';
const Feed = () => {
  const dispatch = useDispatch();

  const feedData = useSelector((store)=>{
    return store.feed;
  })

  const getFeed = async ()=>{
    if(feedData) return;

    try{
      const res = await axios.get(BASE_URL+'/user/feed',{withCredentials:true})
      dispatch(addFeed(res.data.data));  

    }catch(err){
      console.log(err);
    }
    
  }
  useEffect(()=>{
    getFeed();
  }, [])
  if(feedData==null){
    return <h1>Null</h1>
  }
  if(feedData.length<=0){
    console.log(feedData+" "+ feedData.length);
    return <h1> No feed to Show</h1>
  }
  return(
    <div className = "flex justify-center"> 
      <UserCard user = {feedData[0]} /> 
    </div>
  )
}

export default Feed