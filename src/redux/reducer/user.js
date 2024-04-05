import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token_git: "",
  fullname: "",
  user_git: "",
  avatar: "",
  ticket: {
    id: "",
    vms_ids: [],
  },
  service: {
    name: "",
    architectura: "",
    language: "",
    repo: "",
    source: "",
    environment: [],
  },
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    addFullname: (state, action) => {
      state.fullname = action.payload;
    },
    addAccessTokenGit: (state, action) => {
      state.access_token_git = action.payload;
    },
    addUserGit: (state, action) => {
      state.user_git = action.payload;
    },
    addAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    addTicket: (state, action) => {
      state.ticket = action.payload;
    },
    addService: (state, action) => {
      state.service = action.payload;
    },
  },
});

export const {
  addFullname,
  addAccessTokenGit,
  addUserGit,
  addAvatar,
  addTicket,
  addService,
} = user.actions;

export default user.reducer;
