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
  await axiosGithub.post("?client_id=66602684d99f3683ebe0");
}

export async function loginByGithub(code) {
  const response = await axiosServer().get(`auth/login-github?code=${code}`);
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  store.dispatch(addAvatar(response.data.avatar));
  store.dispatch(addFullname(response.data.fullname));
}

export async function GetInfoUserGitByAccesToken() {
  const response = await axiosServer().post(`git/user-git-token`);
  return response.data;
}

export async function GetReposGitByAccessToken() {
  const response = await axiosServer().post(`git/repos-git-token`);
  return response.data.data;
}

export async function GetBranchesByAccessToken(repository) {
  const response = await axiosServer().post(`git/branches`, {
    repository: repository,
  });

  return response.data.data;
}

export async function GetLanguagesByAccessToken(repository) {
  const response = await axiosServer().post(`git/languages`, {
    repository: repository,
  });

  return response.data.data;
}

export async function GetPathFileDockerByAccessToken(repository, branch) {
  const response = await axiosServer().post(`git/paths-file-docker`, {
    repository: repository,
    branch: branch,
  });

  return response.data;
}

export async function GetContentsByAccessToken(repository, sha) {
  const response = await axiosServer().post(`git/content-file`, {
    repository: repository,
    sha: sha,
  });

  return response.data;
}

