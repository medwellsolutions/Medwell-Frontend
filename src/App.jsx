import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body'
import Feed from './components/Feed';
import Login from './components/Login';
import Profile from './components/Profile';
import {Provider} from 'react-redux';
import appStore from './utils/appStore';
import Connections from './components/Connections';
import ConnectionRequests from './components/ConnectionRequests';
function App() {

  return (
    <>
    <Provider store = {appStore}>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path = '/' element = {<Body/>}>
            <Route path = '/' element = {<Feed/>}></Route>
            <Route path = '/feed' element = {<Feed/>}></Route>
            <Route path = '/login' element = {<Login/>}> </Route>
            <Route path = '/profile' element ={<Profile/>}></Route>
            <Route path = '/connections' element = {<Connections/>} ></Route>
            <Route path = '/connectionrequests' element = {<ConnectionRequests/>} ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
    
    </>
  )
}

export default App
