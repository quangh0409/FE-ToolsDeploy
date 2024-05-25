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
    return response.data;
  },
  "forgot-password": (email) => async () => {
    const response = await axiosServer.post("auth/forgot-password", {
      email: email,
    });
    return response.data;
  },
};

export default authApi;
