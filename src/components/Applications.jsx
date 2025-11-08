import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function format12HourTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `sent Request at ${hours} ${ampm} ${month}/${day}/${year}`;
}


const Applications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(BASE_URL+"/admin/applications", 
                {withCredentials: true} )
            setApplications(res?.data?.data || []);
        }
        
        fetchData();
    }, [])
    const handleView = (applicant)=>{
        navigate(`/home/admin/application/${applicant._id}`)
    }
  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-8 text-center">Applications</h2>
        <ul className="bg-base-100 rounded-2xl shadow-lg divide-y divide-gray-200">
          {applications.map((applicant) => (
            <li key={applicant._id} className="flex items-center justify-between px-8 py-6 transition-all rounded-xl hover:shadow-md hover:scale-[1.02]">
              <div>
                <div className="font-bold text-2xl">
                  {applicant.firstName + " " + applicant.lastName}
                </div>
                <div className="text-base uppercase font-semibold opacity-70 mt-1">
                  Role: {applicant.role}
                </div>
                <div className="text-base opacity-70 mt-1">
                  {format12HourTime(applicant.createdAt)}
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline btn-primary rounded-full px-8 text-lg"
                onClick={() => handleView(applicant)} >View
              </button>
            </li>
          ))}

          {applications.length === 0 && (
            <div className="py-8 text-center text-lg text-gray-500">
              No applications found.
            </div>
          )}

        </ul>
  </div>
</div>


  )
}

export default Applications