import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { BASE_URL } from '../utils/constants';
import pic from '../utils/DP.jpg';
import { useNavigate } from 'react-router-dom';
const EditProfile = ({data}) => {
    const [firstName, setFirstName] = useState(data.firstName);
    const [lastName, setLastName] = useState(data.lastName);
    const [age, setAge] = useState(data.age);
    const [gender,setGender] = useState(data.gender);
    const [about,setAbout] = useState(data.about);
    const [skills, setSkills] = useState(data.skills);
    const [photoUrl, setPhotoUrl] = useState(data.photoUrl);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const update = async ()=>{
        try{
            const res = await axios.patch(BASE_URL+'/profile/edit',{
            firstName,
            lastName,
            age,
            gender,
            about,
            photoUrl
        },
            {withCredentials:true} )
            setShowToast(true);
            {setInterval( ( )=>{
              setShowToast(false);
            },3000 )}
            navigate('/feed')
            setError("");
        }catch(err){
            setError(err?.response?.data);
        }
        
    }
    
  return (
    <div className='flex justify-around'>
        <div className = "flex ietms-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl mt-5">
        <div className="card-body">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">firstName</legend>
            <input value = {firstName} onChange={(e)=>{
              setFirstName(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">lastName</legend>
            <input value = {lastName} onChange={(e)=>{
              setLastName(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age</legend>
            <input value = {age} onChange={(e)=>{
              setAge(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <input value = {gender} onChange={(e)=>{
              setGender(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">About</legend>
            <input value = {about} onChange={(e)=>{
              setAbout(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">photoUrl</legend>
            <input value = {photoUrl} onChange={(e)=>{
              setPhotoUrl(e.target.value);
            }} type="text" className="input" placeholder="Type here" />
          </fieldset>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button onClick = {update} className="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div className="card bg-base-100 w-96 shadow-sm my-10">
          <figure className="h-100">
            <img
              src={photoUrl}
                alt="Shoes" />
          </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName+ " "+ lastName}</h2>
          <h2 className="card-title">{gender+" "+age}</h2>
          <h2>{}</h2>
           <p>{about}</p>
             <div className="card-actions justify-around">
             </div>
          </div>        
        </div>
        {showToast && (<div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Message sent successfully.</span>
          </div>  
        </div>) }
    </div>
    
  )
}

export default EditProfile