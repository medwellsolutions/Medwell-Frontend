import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
const UserCard = ({user})=>{
    const { _id, firstName, lastName, skills, photoUrl } = user;
    
    const dispatch = useDispatch();
    const handleClick = async (stat, id)=>{
        try{
            const res = await axios.post(BASE_URL+"/request/send/"+stat+"/"+id,
                {},
                {withCredentials:true}
            )
            dispatch(removeUserFromFeed(id));
        }catch(err){
            console.log(err);
        }
        
    }
    return(
        <div className="card bg-base-100 w-96 shadow-sm my-5">
            <figure className="h-100">
                <img
                src={photoUrl}
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{firstName+ " "+ lastName}</h2>
                <p>{skills}</p>
                <div className="card-actions justify-around">
                <button className="btn btn-secondary" onClick ={()=>{handleClick("ignored",_id)}} >Ignore</button>
                <button className="btn btn-primary" onClick ={()=>{handleClick("interested",_id)}}  >Interested</button>
                </div>
            </div>
        </div>
    )
}
export default UserCard;