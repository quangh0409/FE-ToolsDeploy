import axios from "axios";
import axiosServer from "./axios";
import { store } from "../redux/store";
import { addAvatar, addFullname } from "../redux/reducer/user";

const axiosGithub = axios.create({
  baseURL: "https://github.com/login/oauth/authorize",
  headers: {
    Accept: "application/json",
  },
});

export async function loginWithGithub() {
  const response = await axiosGithub.post("?client_id=66602684d99f3683ebe0");
}

export async function loginByGithub(code) {
  const response = await axiosServer().get(
    `auth/login-github?code=${code}`
  );
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  store.dispatch(addAvatar(response.data.avatar));
  store.dispatch(addFullname(response.data.fullname));
}

export async function GetInfoUserGitByAccesToken(user) {
  const response = await axiosServer().post(`git/user-git-token`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
  });
  
  return response.data;
}

export async function GetReposGitByAccessToken(user) {
  const response = await axiosServer().post(`git/repos-git-token`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
  });

  return response.data;
}

export async function GetBranchesByAccessToken(user, repository) {
  const response = await axiosServer().post(`git/branches`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
    repository: localStorage.getItem("repo"),
  });

  return response.data.data;
}

export async function GetLanguagesByAccessToken(user, repository) {
  const response = await axiosServer().post(`git/languages`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
    repository: localStorage.getItem("repo"),
  });

  return response.data.data;
}

export async function GetGithub() {}
