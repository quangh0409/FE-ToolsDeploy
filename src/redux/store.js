import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducer/user";
import log from "./reducer/log";

const rootReducer = combineReducers({
  user: user,
  log: log,
});

export const store = configureStore({
  reducer: rootReducer,
});
