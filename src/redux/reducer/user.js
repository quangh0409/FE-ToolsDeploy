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
    environments: [],
  },
  vm: "",
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
      state.service.name = action.payload.name
        ? action.payload.name
        : state.service.name;
      state.service.architectura = action.payload.architectura
        ? action.payload.architectura
        : state.service.architectura;
      state.service.language = action.payload.language
        ? action.payload.language
        : state.service.language;
      state.service.repo = action.payload.repo
        ? action.payload.repo
        : state.service.repo;
      state.service.source = action.payload.source
        ? action.payload.source
        : state.service.source;
      state.service.environments = action.payload.environments
        ? action.payload.environments
        : state.service.environments;
    },
    addVm: (state, action) => {
      state.vm = action.payload;
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
  addVm,
} = user.actions;

export default user.reducer;
