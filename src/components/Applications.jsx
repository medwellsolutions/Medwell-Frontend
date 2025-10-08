import React, { useEffect, useState } from 'react'

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
import { BASE_URL } from '../utils/constants'
import axios from 'axios'

const Applications = () => {
    const [applications, setApplications] = useState([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(BASE_URL+"/admin/applications", 
                {withCredentials: true} )
            setApplications(res?.data?.data || []);
            console.log(res);
        }
        
        fetchData();
    }, [])
  return (
    <div className="flex justify-center py-8">
  <div className="w-full max-w-2xl">
    <h2 className="text-2xl font-bold mb-4 text-center">Applications</h2>
    <ul className="bg-base-100 rounded-xl shadow-md divide-y divide-gray-200">
      {applications.map((applicant) => (
        <li key={applicant._id} className="flex items-center justify-between px-4 py-3 transition-all rounded-lg hover:shadow-sm hover:scale-[1.01]">
          <div>
            <div className="font-semibold text-base">
              {applicant.firstName + " " + applicant.lastName}
            </div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Role: {applicant.role}
            </div>
            <div className="text-xs opacity-60">
               {format12HourTime(applicant.createdAt)}
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline btn-primary rounded-full"
            onClick={() => handleView(applicant)} >View
          </button>
        </li>
      ))}

      {applications.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">
          No applications found.
        </div>
      )}
    </ul>
  </div>
</div>


  )
}

export default Applications