import axios from "axios";

const host = process.env.REACT_APP_CA_BE_FE_HOST;
const port = process.env.REACT_APP_CA_BE_FE_PORT;
const baseURL = process.env.REACT_APP_CA_BE_FE_baseURL;
const axiosServer = axios.create({
  baseURL: `https://${baseURL}/api/v1/`,
  // baseURL: `https://${host}:${port}/api/v1/`,
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
      window.location.href = "/";
    }
    return error.response;
  }
);
export default axiosServer;
