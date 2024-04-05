import {
  addAccessTokenGit,
  addAvatar,
  addFullname,
  addTicket,
} from "../redux/reducer/user";
import { store } from "../redux/store";
import axiosServer from "./axios";

export async function getTicketDetail() {
  const response = await axiosServer().get(`ticket/`);
  store.dispatch(addAvatar(response.data.user.avatar));
  store.dispatch(addFullname(response.data.user.fullname));
  store.dispatch(
    addTicket({ id: response.data.id, vms_ids: response.data.vms_ids })
  );
  localStorage.setItem("token", response.data.github.access_token);
}

export async function UpdateTicket(vms_ids) {
  const response = await axiosServer().put(`ticket/`, { vms_ids });
  return response.data;
}
