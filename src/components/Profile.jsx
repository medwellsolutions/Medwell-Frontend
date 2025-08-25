import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'
const Profile = () => {
  const user = useSelector((store)=>{
        return store.user;
    })
    console.log(user);
  return user && (
    <div>
      <EditProfile data ={user}/>
    </div>
  )
}

export default Profile