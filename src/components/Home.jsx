import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user?.data);

  useEffect(() => {
    if (user) return; // already loaded
    axios
      .get(BASE_URL + '/profile', { withCredentials: true })
      .then((res) => dispatch(addUser(res.data)))
      .catch(() => navigate('/login'));
  }, []);

  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  );
};

export default Home;