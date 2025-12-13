import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user.js';


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

