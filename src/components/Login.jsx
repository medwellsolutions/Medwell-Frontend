import React, { use, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import {addUser} from  '../utils/userSlice';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const logo = import.meta.env.VITE_MEDWELL_LOGO
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailId, setEmailId] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [error, setError] = useState('')

  const login = async () => {
    try {
      const res = await axios.post(BASE_URL + '/login', { emailId, password }, { withCredentials: true })
      dispatch(addUser(res.data));
      const nextRoute = res?.data?.data?.nextRoute
      navigate(nextRoute)
    } catch (err) {
      setError(err?.response?.data || 'Try again')
      console.log(err)
    }
  }

  const signup = async () => {
    try {
      await axios.post(
        BASE_URL + '/signup',
        { firstName, lastName, emailId, password, phone, location, role},
        { withCredentials: true }
      )
      setIsLoginForm(true)
      setError('')
    } catch (err) {
      setError(err?.response?.data || 'Try again')
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Top Section */}
      <div className="text-center mb-6">
        <img
          src={logo}
          alt="Medwell Logo"
          className="h-16 mx-auto object-contain mb-2"
        />
        <h1 className="text-3xl font-semibold text-gray-900 mt-4">
          Welcome to <span className="text-indigo-600">Medwell!</span>
        </h1>
        <p className="text-gray-500 mt-1">Please enter your details</p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setIsLoginForm(true)}
            className={`px-6 py-2 rounded-md font-medium text-sm ${
              isLoginForm
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginForm(false)}
            className={`px-6 py-2 rounded-md font-medium text-sm ${
              !isLoginForm
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Card Section */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        {isLoginForm ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter your Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={login}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition"
            >
              LOGIN
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter your Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your First Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your Last Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your Location"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Role</option>
                <option value="supplier">Supplier</option>
                <option value="participant">Participant</option>
                <option value="non-profit">Non-profit</option>
                <option value="sponsor">Sponsor</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {error && (
              <div className="sm:col-span-2 text-sm text-red-600">{error}</div>
            )}
            <div className="sm:col-span-2">
              <button
                onClick={signup}
                className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
