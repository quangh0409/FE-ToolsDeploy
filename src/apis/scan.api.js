import axiosServer from "./axios";

const scanApi = {
  scanSyxtax: (content) => async () => {
    const response = await axiosServer.post("scan/scan-syntax", {
      content: content,
    });
    return response;
  },
  scanImage: (image) => async () => {
    const response = await axiosServer.post("scan/scan-image", {
      image: image,
    });
    return response;
  },
};

export default scanApi;
