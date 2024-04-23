import axiosServer from "./axios";

const scanApi = {
  scanSyxtax: (content) => async () => {
    const response = await axiosServer.post("scan/scan-syntax", {
      content: content,
    });
    return response.data;
  },
};

export default scanApi;
