import axios from "axios";
import axiosServer from "./axios";

const vmsApi = {
  createVMS: (hostVM, portVM,userVM, passVM, standardVM) => async () => {
    const response = await axiosServer.post(`vms/`, {
      host: hostVM,
      user: userVM,
      pass: passVM,
      port: portVM,
      standard: standardVM,
    });
    return response;
  },
  updateVms: (vms, userVM, passVM) => async () => {
    const response = await axiosServer.put(`vms/${vms}`, {
      user: userVM,
      pass: passVM,
    });
    return response;
  },
  getVmsByIds: (vms_ids, host) => async () => {
    const response = await axiosServer.post(
      `vms/ids?host=${host ? host : ""}`,
      {
        ids: vms_ids,
      }
    );
    return response;
  },
  getVmsById: (vms) => async () => {
    const response = await axiosServer.get(`vms/${vms}`);
    return response;
  },
  createService: (service) => async () => {
    const response = await axiosServer.post("services/", { service });
    return response;
  },
  updateService: (service, id) => async () => {
    const response = await axiosServer.put(`services/${id}`, { service });
    return response;
  },
  getAllServiceByVMId: (vm) => async () => {
    const response = await axiosServer.get(`services/vm/${vm}`);
    return response;
  },
  getServiceById: (service) => async () => {
    const response = await axiosServer.get(`services/${service}`);
    return response;
  },
  deleteServiceById: (service, vm) => async () => {
    const response = await axiosServer.delete(`services/${service}/vm/${vm}`);
    return response;
  },
  getImagesOfServiceById: (service, env) => async () => {
    const response = await axiosServer.post(`services/images`, {
      service: service,
      env: env,
    });
    return response;
  },
  scanImageOfService: (service, env, image) => async () => {
    const response = await axiosServer.get(
      `services/images?service=${service}&env=${env}&image=${image}`
    );
    return response;
  },
  deleteVmsById: (vms, ticket) => async () => {
    const response = await axiosServer.delete(`vms/${vms}/ticket/${ticket}`);
    return response;
  },
  getRecordsOfService: (service, env) => async () => {
    const response = await axiosServer.get(
      `record/?service=${service}&env=${env}`
    );
    return response;
  },

  findVmsByHost: (host) => async () => {
    const response = await axiosServer.get(`vms/?host=${host}`);
    return response;
  },

  findServiceInVmsByName: (vm, service) => async () => {
    const response = await axiosServer.get(
      `services/?vm=${vm}&service=${service}`
    );
    return response;
  },
  getRecordById: (record) => async () => {
    const response = await axiosServer.get(`record/${record}`);
    return response;
  },
  runPostman: (collection, environment, service, env, branch) => async () => {
    const response = await axiosServer.post(`postman`, {
      collection: collection,
      environment: environment,
      service: service,
      env: env,
      branch: branch,
    });
    return response;
  },
  findContaninersOfVmById: (vms, name) => async () => {
    const uri = name
      ? `vms/${vms}/contaniners?name=${name}`
      : `vms/${vms}/contaniners`;
    const response = await axiosServer.get(uri);
    return response;
  },
  findImagesOfVmById: (vms, name) => async () => {
    const uri = name ? `vms/${vms}/images?name=${name}` : `vms/${vms}/images`;
    const response = await axiosServer.get(uri);
    return response;
  },
  installDocker: (vms) => async () => {
    const uri = `vms/${vms}/install-docker`;
    const response = await axiosServer.get(uri);
    return response;
  },
  installTrivy: (vms) => async () => {
    const uri = `vms/${vms}/install-trivy`;
    const response = await axiosServer.get(uri);
    return response;
  },
  installHadolint: (vms) => async () => {
    const uri = `vms/${vms}/install-hadolint`;
    const response = await axiosServer.get(uri);
    return response;
  },
  getStandards: (standards) => async () => {
    const response = await axiosServer.post(`vms/standards/get-all`, {
      standards: standards,
    });
    return response;
  },
  deleteStandard: (ticket, standard) => async () => {
    const response = await axiosServer.post(`vms/standards/delete`, {
      ticket: ticket,
      standard: standard,
    });
    return response;
  },
  createStandard: (standard) => async () => {
    const response = await axiosServer.post(`vms/standards/`, standard);
    return response;
  },
  compareStandard: (standard, vms) => async () => {
    const response = await axiosServer.post(`vms/standards/compare`, {
      standard: standard,
      vms: vms,
    });
    return response;
  },
  compareStandardBeforeCreate: (standard, host, port, user, pass) => async () => {
    const response = await axiosServer.post(
      `vms/standards/compare-before-create-vms`,
      {
        standard: standard,
        host: host,
        port: port,
        user: user,
        pass: pass,
      }
    );
    return response;
  },
  actionsContainerByByVmsIdAndContainerId:
    (vms, contaniner, action) => async () => {
      const response = await axiosServer.get(
        `vms/${vms}/contaniners/${contaniner}?action=${action}`
      );
      return response;
    },
  actionsImagesOfVmById: (vms, image) => async () => {
    const response = await axiosServer.delete(`vms/${vms}/images/${image}`);
    return response;
  },
};

export default vmsApi;
