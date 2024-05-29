import axiosServer from "./axios";

const scanApi = {
  scanSyxtax: (content) => async () => {
    const response = await axiosServer.post("scan/scan-syntax", {
      content: content,
    });
    return response;
  },
};

export default scanApi;
