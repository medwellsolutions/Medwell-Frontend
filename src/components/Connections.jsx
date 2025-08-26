import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store)=>{
        return store.connections
    })
    const connectionData = async ()=>{
        try{
            const res = await axios.get(BASE_URL+"/user/connections",
                {withCredentials:true}
            )
            dispatch(addConnections(res.data.data));
        }catch(err){
            console.log(err);        }
    }
    useEffect( ()=>{
        connectionData();
    }, [] )
  return connections && (
    <div className='text-center w-1/2 my-5 mx-auto'>
            <ul className="list bg-base-100 rounded-box shadow-md">
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Connections</li>
              {connections.map((connection,index)=>{
                const {firstName, lastName, photoUrl, about} = connection;
                return (
                    <li className="list-row">
                     <div className="text-4xl font-thin opacity-30 tabular-nums">{index+1}</div>
                     <div><img className="size-10 rounded-box" src={photoUrl}/></div>
                     <div className="list-col-grow">
                        <div>{firstName +" "+lastName}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{about}</div>
                     </div>
                    </li>
                )
              })}  
            </ul>
    </div>
  )
}

export default Connections