import { useSelector } from "react-redux";
import axiosServer from "./axios";

export async function createVMS(hostVM, userVM, passVM) {
  const response = await axiosServer().post(`vms/`, {
    host: hostVM,
    user: userVM,
    pass: passVM,
  });
  return response.data;
}

export async function getVmsByIds(vms_ids) {
  const response = await axiosServer().post(`vms/ids`, { ids: vms_ids });
  return response.data;
}

export async function createService(service) {
  const response = await axiosServer().post("services/", { service });
  return response.data;
}

export async function getAllServiceByVMId(vm) {
  const response = await axiosServer().get(`services/vm/${vm}`);
  return response.data;
}

export async function getServiceById(service) {
  const response = await axiosServer().get(`services/${service}`);
  return response.data;
}

export async function deleteServiceById(service) {
  const response = await axiosServer().delete(`services/${service}`);
  return response.data;
}

export async function getImagesOfServiceById(service, env) {
  const response = await axiosServer().post(`services/images`, {
    service: service,
    env: env,
  });
  return response.data;
}

export async function scanImageOfService(service, env, image) {
  const response = await axiosServer().get(
    `services/images?service=${service}&env=${env}&image=${image}`
  );
  return response.data;
}
