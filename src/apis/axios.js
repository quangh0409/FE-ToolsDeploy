import axios from "axios";

// const axiosServer = () => {
//   const axiosTemp = axios.create({
//     baseURL: "http://27.71.26.164:8000/api/v1/",
//   });

//   if (localStorage.getItem("accessToken")) {
//     axiosTemp.defaults.headers.common["token"] =
//       localStorage.getItem("accessToken");
//   }

//   axiosTemp.interceptors.response.use(
//     (response) => {
//       if (response && response.data) {
//         return response;
//       }
//       return response;
//     },

//     (error) => {
//       if (!error.response) {
//         console.error("Unknown error:", error.message);
//         return;
//       }

//       const { status, data } = error.response;
//       if (data.code === "TOKEN_EXPIRED" && status === 401) {
//         localStorage.clear();
//       }
//     }
//   );

//   return axiosTemp;
// };

// export default axiosServer;
const host = process.env.CA_BE_FE_HOST
  ? process.env.CA_BE_FE_HOST
  : "103.166.185.48";
const port = process.env.CA_BE_FE_PORT ? process.env.CA_BE_FE_PORT : "8080";
const axiosServer = axios.create({
  // baseURL: "http://103.166.185.48:8080/api/v1/",
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
  }
);
export default axiosServer;
