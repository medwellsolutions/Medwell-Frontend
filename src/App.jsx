import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Feed from './components/Feed';
import Register from './components/Register';
import Applications from './components/Applications';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path = '/' element = {<Home/>}></Route>
        <Route path = '/' element = {<Body/>}>
        <Route path = '/login' element = {<Login/>}></Route>
        <Route path = '/signup' element = {<Signup/>}></Route>
        <Route path = '/feed' element = {<Feed/>}></Route>
        <Route path = '/register' element = {<Register/>}></Route>
        <Route path = '/admin/applications' element = {<Applications/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
