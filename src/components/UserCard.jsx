import React from "react";
import pic from "../utils/DP.jpg"
const UserCard = ({user})=>{
    const { firstName, lastName, skills, photoUrl } = user;
    return(
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="h-100">
                <img
                src={pic}
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{firstName+ " "+ lastName}</h2>
                <p>{skills}</p>
                <div className="card-actions justify-around">
                <button className="btn btn-secondary">Ignore</button>
                <button className="btn btn-primary">Interested</button>
                </div>
            </div>
        </div>
    )
}
export default UserCard;