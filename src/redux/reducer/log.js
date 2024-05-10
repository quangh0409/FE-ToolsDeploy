import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logRealTimeBuild: [],
  logRealTimeDeploy: [],
  logRealTimeScanImages: [],
  logBuild: [],
  logClear: [],
  logClone: [],
  logDeploy: [],
  logRealTimeClear: [],
  logScanImages: [],
  logScanSyntax: [],
  logSsh: [],
  stepLog: [],
  loading: null,
};

export const log = createSlice({
  name: "log",
  initialState,
  reducers: {
    pushLogRealTimeBuild: (state, action) => {
      state.logRealTimeBuild.push(action.payload);
    },
    pushLogRealTimeDeploy: (state, action) => {
      state.logRealTimeDeploy.push(action.payload);
    },
    pushLogRealTimeScanImages: (state, action) => {
      state.logRealTimeScanImages.push(action.payload);
    },
    pushLogBuild: (state, action) => {
      state.logBuild.push(action.payload);
    },
    pushLogClear: (state, action) => {
      state.logClear.push(action.payload);
    },
    pushLogClone: (state, action) => {
      state.logClone.push(action.payload);
    },
    pushLogDeploy: (state, action) => {
      state.logDeploy.push(action.payload);
    },
    pushLogRealTimeClear: (state, action) => {
      state.logRealTimeClear.push(action.payload);
    },
    pushLogScanImages: (state, action) => {
      state.logScanImages.push(action.payload);
    },
    pushLogScanSyntax: (state, action) => {
      state.logScanSyntax.push(action.payload);
    },
    pushLogSsh: (state, action) => {
      state.logSsh.push(action.payload);
    },
    pushStepLog: (state, action) => {
      state.stepLog.push(action.payload);
    },
    setStepLog: (state, action) => {
      state.stepLog[action.payload.idx].status = action.payload.status;
    },
    addloading: (state, action) => {
      console.log("🚀 ~ action:", action);

      state.loading = action.payload;
    },
  },
});

export const {
  pushLogRealTimeBuild,
  pushLogRealTimeDeploy,
  pushLogRealTimeScanImages,
  pushLogBuild,
  pushLogClear,
  pushLogClone,
  pushLogDeploy,
  pushLogRealTimeClear,
  pushLogScanImages,
  pushLogScanSyntax,
  pushLogSsh,
  pushStepLog,
  setStepLog,
  addloading,
} = log.actions;

export default log.reducer;
