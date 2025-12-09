import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import eventReducer from "./eventSlice";

const appStore = configureStore({
    reducer:{
        user:userReducer,
        events:eventReducer,
    }
})

export default appStore;