import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body'
import Feed from './components/Feed';
import Login from './components/login';
import Profile from './components/Profile';
function App() {

  return (
    <>
    <BrowserRouter basename='/'>
    <Routes>
      <Route path = '/' element = {<Body/>}>
        <Route path = '/feed' element = {<Feed/>}></Route>
        <Route path = '/login' element = {<Login/>}> </Route>
        <Route path = '/Profile' element ={< Profile/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
