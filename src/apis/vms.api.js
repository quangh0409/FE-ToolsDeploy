import axiosServer from "./axios";

const vmsApi = {
  createVMS: (hostVM, userVM, passVM) => async () => {
    const response = await axiosServer.post(`vms/`, {
      host: hostVM,
      user: userVM,
      pass: passVM,
    });
    return response.data;
  },
  getVmsByIds: (vms_ids) => async () => {
    const response = await axiosServer.post(`vms/ids`, { ids: vms_ids });
    return response.data;
  },
  getVmsById: (vms) => async () => {
    const response = await axiosServer.get(`vms/${vms}`);
    return response.data;
  },
  createService: (service) => async () => {
    const response = await axiosServer.post("services/", { service });
    return response.data;
  },
  getAllServiceByVMId: (vm) => async () => {
    const response = await axiosServer.get(`services/vm/${vm}`);
    return response.data;
  },
  getServiceById: (service) => async () => {
    const response = await axiosServer.get(`services/${service}`);
    return response.data;
  },
  deleteServiceById: (service) => async () => {
    const response = await axiosServer.delete(`services/${service}`);
    return response.data;
  },
  getImagesOfServiceById: (service, env) => async () => {
    const response = await axiosServer.post(`services/images`, {
      service: service,
      env: env,
    });
    return response.data;
  },
  scanImageOfService: (service, env, image) => async () => {
    const response = await axiosServer.get(
      `services/images?service=${service}&env=${env}&image=${image}`
    );
    return response.data;
  },
  deleteVmsById: (vms) => async () => {
    const response = await axiosServer.delete(`vms/${vms}`);
    return response.data;
  },
  getRecordsOfService: (service, env) => async () => {
    const response = await axiosServer.get(
      `record/?service=${service}&env=${env}`
    );
    return response.data;
  },
};

export default vmsApi;
