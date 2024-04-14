import axiosServer from "./axios";

export async function scanSyxtax(content) {
    const response = await axiosServer().post("scan/scan-syntax", { content: content });
    return response.data;
  }