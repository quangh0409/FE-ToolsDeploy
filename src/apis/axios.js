import axios from "axios";

const axiosServer = () => {
  const axiosTemp = axios.create({
    baseURL: "http://35.213.147.74:8000/api/v1/",
  });

  return axiosTemp;
};

export default axiosServer;
