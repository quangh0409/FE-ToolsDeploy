import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducer/user";
import log from "./reducer/log";
import record from "./reducer/record";

const rootReducer = combineReducers({
  user: user,
  log: log,
  record: record,
});

export const store = configureStore({
  reducer: rootReducer,
});
