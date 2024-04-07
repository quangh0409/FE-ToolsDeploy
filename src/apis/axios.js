import axios from "axios";

const axiosServer = () => {
  const axiosTemp = axios.create({
    baseURL: "http://35.213.167.216:8000/api/v1/",
    // baseURL: `http://localhost:${port}/api/v1/`,
  });

  if (localStorage.getItem("accessToken")) {
    axiosTemp.defaults.headers.common["token"] =
      localStorage.getItem("accessToken");
  }

  // axiosTemp.interceptors.request.use(async (config) => {
  //   const token = localStorage.getItem("accessToken");

  //   if (token) {
  //     config.headers["token"] = token;
  //   }

  //   return config;
  // });

  axiosTemp.interceptors.response.use(
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
        // TODO: Show server error message
        // } else if (400 <= status && status < 500) {
        //   // throw new CustomError(data);
        // message.error("Hết phiên đăng nhập");
        localStorage.clear();
      }
    }
  );

  return axiosTemp;
};

export default axiosServer;
