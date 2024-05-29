import axios from "axios";

const host = process.env.REACT_APP_CA_BE_FE_HOST
  ? process.env.REACT_APP_CA_BE_FE_HOST
  : "103.166.185.48";
const port = process.env.REACT_APP_CA_BE_FE_PORT
  ? process.env.REACT_APP_CA_BE_FE_PORT
  : "8080";
const axiosServer = axios.create({
  // baseURL: "http://127.0.0.1:8080/api/v1/",
  baseURL: `http://${host}:${port}/api/v1/`,
});
axiosServer.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["token"] = accessToken;
  }
  return config;
});

axiosServer.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response;
    }
    return response;
  },

  (error) => {
    if (!error.response) {
      console.error("Unknown error:", error.message);
      return;
    }

    const { status, data } = error.response;
    if (data.code === "TOKEN_EXPIRED" && status === 401) {
      localStorage.clear();
    }
    return error.response;
  }
);
export default axiosServer;
