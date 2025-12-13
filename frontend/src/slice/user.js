import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { 
    email: "", 
    username: "", 
    role: "" ,
    avatar:""
  },

  reducers: {
    setUser: (state, action) => {
      const { email, username, role,avatar } = action.payload;
      state.email = email;
      state.username = username;
      state.role = role;
      state.avatar = avatar
    },

    clearUser: (state) => {
      state.email = "";
      state.username = "";
      state.role = "";
      state.avatar = avatar;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
