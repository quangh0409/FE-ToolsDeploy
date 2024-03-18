import axios from "axios";

const axiosServer = (port) => {
  const axiosTemp = axios.create({
    baseURL: "http://35.213.147.74:8000/api/v1/",
    // baseURL: `http://localhost:${port}/api/v1/`,
  });

  if (localStorage.getItem("accessToken")) {
    axiosTemp.defaults.headers.common["token"] =
      localStorage.getItem("accessToken");
  }

  return axiosTemp;
};

export default axiosServer;
