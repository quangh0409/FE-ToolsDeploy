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
  updateVms: (vms, userVM, passVM) => async () => {
    const response = await axiosServer.put(`vms/${vms}`, {
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
  updateService: (service, id) => async () => {
    const response = await axiosServer.put(`services/${id}`, { service });
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
  deleteServiceById: (service, vm) => async () => {
    const response = await axiosServer.delete(`services/${service}/vm${vm}`);
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
  deleteVmsById: (vms, ticket) => async () => {
    const response = await axiosServer.delete(`vms/${vms}/ticket/${ticket}`);
    return response.data;
  },
  getRecordsOfService: (service, env) => async () => {
    const response = await axiosServer.get(
      `record/?service=${service}&env=${env}`
    );
    return response.data;
  },

  findVmsByHost: (host) => async () => {
    const response = await axiosServer.get(`vms/?host=${host}`);
    return response.data;
  },

  findServiceInVmsByName: (vm, service) => async () => {
    const response = await axiosServer.get(
      `services/?vm=${vm}&service=${service}`
    );
    return response.data;
  },
  getRecordById: (record) => async () => {
    const response = await axiosServer.get(`record/${record}`);
    return response.data;
  },
  runPostman: (collection, environment, service, env, branch) => async () => {
    const response = await axiosServer.post(`postman`, {
      collection: collection,
      environment: environment,
      service: service,
      env: env,
      branch: branch,
    });
    return response.data;
  },
};

export default vmsApi;
