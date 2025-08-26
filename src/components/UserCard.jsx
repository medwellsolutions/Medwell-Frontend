import React from "react";
const UserCard = ({user})=>{
    const { firstName, lastName, skills, photoUrl } = user;
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
                <button className="btn btn-secondary">Ignore</button>
                <button className="btn btn-primary">Interested</button>
                </div>
            </div>
        </div>
    )
}
export default UserCard;