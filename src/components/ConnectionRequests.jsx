import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../utils/requestSlice'
import axios from 'axios'

const ConnectionRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store)=>{
    return store.requests;
  })

  const handleRequest= async (stat,_id)=>{
    try{
        const res = await axios.post(BASE_URL+"/request/review/"+stat+"/"+_id,{},
        {withCredentials:true}
    );
    }catch(err){
        console.log(err);
    }
    dispatch(removeRequest(_id));

  }
  const getRequests = async ()=>{
    try{
      const res = await axios.get(BASE_URL+"/user/requests/received",
        {withCredentials:true}
      )
      dispatch(addRequest(res?.data?.data));
    }catch(err){
        console.log(err);
    }    
  } 
  useEffect(()=>{
    getRequests();
  },[])

  return requests && (
    <div className='text-center w-1/2 my-5 mx-auto'>
            <ul className="list bg-base-100 rounded-box shadow-md">
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Requests</li>
              {requests.map((request,index)=>{
                const {_id, firstName, lastName, photoUrl, about} = request.fromUserId;
                return (
                    <li key = {_id} className="list-row">
                     <div className="text-4xl font-thin opacity-30 tabular-nums">{index+1}</div>
                     <div><img className="size-10 rounded-box" src={photoUrl}/></div>
                     <div className="list-col-grow">
                        <div>{firstName +" "+lastName}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{about}</div>
                     </div>
                     <button className="btn btn-success" onClick={ ()=>{
                        handleRequest("accepted",request._id)} 
                     } 
                     >Accept</button>
                     <button className="btn btn-secondary" onClick={()=>{
                        handleRequest("rejected",request._id)} 
                     }
                     >Ignore</button>

                    </li>
                )
              })}  
            </ul>
    </div>
  )
}

export default ConnectionRequests