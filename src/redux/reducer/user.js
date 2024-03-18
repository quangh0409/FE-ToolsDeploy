import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token_git: "",
  fullname: "",
  user_git: "",
  avatar: "",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    addFullname: (state, action) => {
      const { fullname = "" } = action.payload;
      state.fullname = fullname || state.fullname;
    },
    addAccessTokenGit: (state, action) => {
      const { access_token_git = "" } = action.payload;
      state.access_token_git = access_token_git || state.access_token_git;
    },
    addUserGit: (state, action) => {
      const { user_git = "" } = action.payload;
      state.user_git = user_git || state.user_git;
    },
    addAvatar: (state, action) => {
      const { avatar = "" } = action.payload;
      state.avatar = avatar || state.avatar;
    },
  },
});

export const { addFullname, addAccessTokenGit, addUserGit, addAvatar } =
user.actions;

export default user.reducer;
