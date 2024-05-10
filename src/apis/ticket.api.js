import { addAvatar, addFullname, addTicket } from "../redux/reducer/user";
import { store } from "../redux/store";
import axiosServer from "./axios";

const ticketApi = {
  getTicketDetail: () => async () => {
    const response = await axiosServer.get(`ticket/`);
    store.dispatch(addAvatar(response.data.user.avatar));
    store.dispatch(addFullname(response.data.user.fullname));
    store.dispatch(
      addTicket({
        id: response.data.id,
        vms_ids: response.data.vms_ids,
        github: response.data.github,
      })
    );
    localStorage.setItem("token", response.data.github.access_token);
    return response.data;
  },
  UpdateTicket: (vms_ids) => async () => {
    const response = await axiosServer.put(`ticket/`, { vms_ids });
    return response.data;
  },
};

export default ticketApi;
