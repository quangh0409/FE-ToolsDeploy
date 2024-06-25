import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rowKeys: [],
  data: [],
  tour: {
    webApp: false,
    yourGit: false,
    stepYourGit: false,
    connectVM: false,
    pipeline: false,
    header: false,
    dashboard: false,
  },
  access_token_git: "",
  fullname: "",
  user_git: "",
  avatar: "",
  ticket: {
    id: "",
    vms_ids: [],
    github: {},
    standard_ids: [],
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
  user_id: "",
  environments: [
    {
      name: "",
      vm: "",
      branch: "",
      docker_file: [],
      docker_compose: [],
      postman: {
        collection: {},
        environment: {},
      },
    },
  ],
  dockerConfig: {
    docker_file: [],
    docker_compose: [],
  },
  deploy: {
    type: "",
    serivce_id: undefined,
    service_name: undefined,
    architecture: undefined,
    repo: undefined,
    branch: undefined,
    language: undefined,
    env_name: undefined,
    vm: {
      id: undefined,
      host: undefined,
    },
    loading: true,
    environment: {
      name: "",
      vm: {
        id: undefined,
        host: undefined,
      },
      branch: undefined,
      docker_file: [],
      docker_compose: [],
      postman: {
        collection: {},
        environment: {},
      },
    },
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
    addUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setEnvironments: (state, action) => {
      state.environments = action.payload;
    },
    setTourHeader: (state, action) => {
      state.tour.header = action.payload;
    },
    setTourDashboard: (state, action) => {
      state.tour.dashboard = action.payload;
    },
    setTourPipeline: (state, action) => {
      state.tour.pipeline = action.payload;
    },
    setTourConnectVM: (state, action) => {
      state.tour.connectVM = action.payload;
    },
    setTourWebapp: (state, action) => {
      state.tour.webApp = action.payload;
    },
    setTourYourGit: (state, action) => {
      state.tour.yourGit = action.payload;
    },
    setTourStepYourGit: (state, action) => {
      state.tour.stepYourGit = action.payload;
    },
    setData: (state, action) => {
      state.data.push(action.payload);
    },
    setClearData: (state, action) => {
      state.data = [];
    },
    setRowKeys: (state, action) => {
      state.rowKeys = action.payload;
    },
    setDeploy: (state, action) => {
      state.deploy = action.payload;
    },
    setDockerConfig: (state, action) => {
      state.dockerConfig = action.payload;
    },
    setClearDockerConfig: (state, action) => {
      state.dockerConfig = {
        docker_file: [],
        docker_compose: [],
      };
    },
    setClearDeploy: (state, action) => {
      state.deploy = {
        type: "",
        serivce_id: undefined,
        service_name: undefined,
        architecture: undefined,
        repo: undefined,
        branch: undefined,
        language: undefined,
        env_name: undefined,
        vm: {
          id: undefined,
          host: undefined,
        },
        loading: true,
        environment: {
          name: "",
          vm: {
            id: undefined,
            host: undefined,
          },
          branch: undefined,
          docker_file: [],
          docker_compose: [],
          postman: {
            collection: {},
            environment: {},
          },
        },
      };
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
  addUserId,
  setEnvironments,
  setTourHeader,
  setTourDashboard,
  setTourPipeline,
  setTourConnectVM,
  setTourWebapp,
  setTourYourGit,
  setTourStepYourGit,
  setData,
  setClearData,
  setRowKeys,
  setDeploy,
  setDockerConfig,
  setClearDockerConfig,
  setClearDeploy,
} = user.actions;

export default user.reducer;
