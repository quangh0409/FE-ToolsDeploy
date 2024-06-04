import { addAvatar, addFullname, addUserId } from "../redux/reducer/user";
import { store } from "../redux/store";
import axiosServer from "./axios";

const authApi = {
  login: (email, password) => async () => {
    const response = await axiosServer.post("auth/login", {
      email: email,
      password: password,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("UserId", response.data.id);
    store.dispatch(addAvatar(response.data.avatar));
    store.dispatch(addFullname(response.data.fullname));
    store.dispatch(addUserId(response.data.id));
    return response;
  },
  "forgot-password": (email) => async () => {
    const response = await axiosServer.post("auth/forgot-password", {
      email: email,
    });
    return response;
  },
  "update-password": (old_password, new_password) => async () => {
    const response = await axiosServer.post("auth/update-password", {
      old_password: old_password,
      new_password: new_password,
    });
    return response;
  },
  signUpByGit: (code) => async () => {
    const response = await axiosServer.post(`auth/sign-up-by-git?code=${code}`);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("UserId", response.data.id);
    store.dispatch(addAvatar(response.data.avatar));
    store.dispatch(addFullname(response.data.fullname));
    store.dispatch(addUserId(response.data.id));
    return response;
  },

  signUpNoGit: (email, password, fullname) => async () => {
    const response = await axiosServer.post(`users/no-github`, {
      email: email,
      password: password,
      fullname,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("UserId", response.data.id);
    store.dispatch(addAvatar(response.data.avatar));
    store.dispatch(addFullname(response.data.fullname));
    store.dispatch(addUserId(response.data.id));
    return response;
  },
  connectGit: (code) => async () => {
    const response = await axiosServer.post(`auth/connect-git?code=${code}`);
    return response;
  },
};

export default authApi;
