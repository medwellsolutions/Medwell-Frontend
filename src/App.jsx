import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path = '/' element = {<Home/>}></Route>
        <Route path = '/' element = {<Body/>}>
        <Route path = '/login' element = {<Login/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
