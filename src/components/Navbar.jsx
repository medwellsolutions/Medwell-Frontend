import { useDispatch, useSelector } from "react-redux";
import pic from "../utils/DP.jpg"
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import {removeFeed} from '../utils/feedSlice';
const Navbar = ()=>{
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store)=>{
    return store.user;
  })

  var dp = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  if(userData){
    dp = userData.photoUrl;
  }
  const handleLogout= async ()=>{
    try{
                                                    //{}-> Post should send data, as we are not sending any data we send empty {}
      const res = await axios.post(BASE_URL+'/logout',{},{
        withCredentials:true
      });
      dispatch(removeUser());
      dispatch(removeFeed());
      navigate('/login');
    }catch(err){
      console.log(err.message);
    }
    
  }
    return (
    <div>
        <div className="navbar bg-base-100 shadow-sm">
    <div className="flex-1">
      <Link to ="/feed" className="btn btn-ghost text-xl">DevTinder</Link>
    </div>
    <div className="flex gap-2">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              src= {dp}/>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <Link to ="/profile" className="justify-between">
              Profile
            </Link>
          </li>
          <li>
            <Link to ="/connections" className="justify-between">
              Connections
              <span className="badge">New</span>
            </Link>
            <Link to ="/connectionrequests" className="justify-between">
              Requests
            </Link>
          </li>
          <li><a onClick = {handleLogout}>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
    </div>
    )
}
export default Navbar;