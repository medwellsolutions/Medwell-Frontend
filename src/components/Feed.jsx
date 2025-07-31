import React from 'react'
import { useSelector } from 'react-redux'
const Feed = () => {
  const userData = useSelector((store)=>{
    return store.user;
  })
  
  return (
    <div>{userData.firstName}</div>
  )
}

export default Feed