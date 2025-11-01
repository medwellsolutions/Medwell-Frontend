import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Applications from './components/Applications';
import ViewApplication from './components/ViewApplication';
import ErrorPage from './components/ErrorPage';
import SupplierRegister from './components/SupplierRegister';
import NonProfitRegister from './components/NonProfitRegister';
import SponsorRegister from './components/SponsorRegister';
import DoctorRegister from './components/DoctorRegister';
import ActivityUpload from './components/ActivityUpload';
import MediaViewer from './components/MediaViewer';
import MonthlyEvents from './components/MonthlyEvents';
import Profile from './components/Profile';
import appStore from './utils/appStore';
import { Provider } from 'react-redux';

function App() {

  // return (
  //   <BrowserRouter basename='/'>
  //     <Routes>
  //       {/* <Route path = '/' element = {<Home/>}></Route> */}
  //       <Route path = '/' element = {<Body/>}>
  //       <Route path = '/' element = {<Login/>}></Route>
  //       <Route path = '/signup' element = {<Signup/>}></Route>
  //       <Route path = '/feed' element = {<Feed/>}></Route>
  //       <Route path = 'doctor/register' element = {<DoctorRegister/>}></Route>
  //       <Route path = '/admin/applications' element = {<Applications/>}></Route>
  //       <Route path = '/admin/application/:id' element = {<ViewApplication/>}></Route>
  //       <Route path = '/supplier/register/' element = {<SupplierRegister/>}></Route>
  //       <Route path = '/nonprofit/register/' element = {<NonProfitRegister/>}></Route>
  //       <Route path = '/sponsor/register/' element = {<SponsorRegister/>}></Route>
  //       <Route path="/activity/:eventId" element={<ActivityUpload />} />
  //       <Route path = 'fileView' element = {<MediaViewer fileUrl = "https://s3-bucket-medwell-activity.s3.us-east-2.amazonaws.com/uploads/1761608060020_Licence.jpg" contentType="image"/>}></Route>
  //       <Route  path = '/MonthlyEvents' element = {<MonthlyEvents/>}></Route>
  //       <Route path = '/error' element = {<ErrorPage/>}></Route>
  //       </Route>
  //     </Routes>
  //   </BrowserRouter>
  //)
  return (
    <Provider store = {appStore}>
    <BrowserRouter basename='/'>
      <Routes>
        <Route path = '/' element = {<Login/>} />
          <Route path='/home' element={<Home />}>
           <Route index element={<MonthlyEvents />} />
           <Route path="activity/:eventId" element={<ActivityUpload />} />
           <Route path="profile" element={<Profile />} />
           <Route path = 'admin/applications' element = {<Applications/>}></Route>
          </Route>
          <Route path = 'doctor/register' element = {<DoctorRegister/>}></Route>
          <Route path = '/supplier/register/' element = {<SupplierRegister/>}></Route>
          <Route path = '/nonprofit/register/' element = {<NonProfitRegister/>}></Route>
          <Route path = '/sponsor/register/' element = {<SponsorRegister/>}></Route>

          //needs editing later
          <Route path = '/error' element = {<ErrorPage/>}></Route> 
      </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App
