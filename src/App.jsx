import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Feed from './components/Feed';
import Applications from './components/Applications';
import ViewApplication from './components/ViewApplication';
import ErrorPage from './components/ErrorPage';
import SupplierRegister from './components/SupplierRegister';
import NonProfitRegister from './components/NonProfitRegister';
import SponsorRegister from './components/SponsorRegister';
import DoctorRegister from './components/DoctorRegister';

function App() {

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path = '/' element = {<Home/>}></Route>
        <Route path = '/' element = {<Body/>}>
        <Route path = '/login' element = {<Login/>}></Route>
        <Route path = '/signup' element = {<Signup/>}></Route>
        <Route path = '/feed' element = {<Feed/>}></Route>
        <Route path = 'doctor/register' element = {<DoctorRegister/>}></Route>
        <Route path = '/admin/applications' element = {<Applications/>}></Route>
        <Route path = '/admin/application/:id' element = {<ViewApplication/>}></Route>
        <Route path = '/supplier/register/' element = {<SupplierRegister/>}></Route>
        <Route path = '/nonprofit/register/' element = {<NonProfitRegister/>}></Route>
        <Route path = '/sponsor/register/' element = {<SponsorRegister/>}></Route>
        <Route path = '/error' element = {<ErrorPage/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
