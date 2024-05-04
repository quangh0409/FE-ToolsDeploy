import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  record: {
    id: "",
    status: "",
    ocean: {},
    logs: {},
    created_time: undefined,
    commit_id: undefined,
    commit_message: undefined,
    index: undefined,
  },
};

export const record = createSlice({
  name: "record",
  initialState,
  reducers: {
    setRecord: (state, action) => {
      state.record = action.payload;
    },
  },
});

export const { setRecord } = record.actions;

export default record.reducer;
