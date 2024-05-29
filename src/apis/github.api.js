import axios from "axios";
import axiosServer from "./axios";
import { store } from "../redux/store";
import { addAvatar, addFullname, addUserId } from "../redux/reducer/user";

const axiosGithub = axios.create({
  baseURL: "https://github.com/login/oauth/authorize",
  headers: {
    Accept: "application/json",
  },
});

const githubApi = {
  loginWithGithub: () => async () => {
    return await axiosGithub.post("?client_id=66602684d99f3683ebe0");
  },
  loginByGithub: (code) => async () => {
    const response = await axiosServer.get(`auth/login-github?code=${code}`);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("UserId", response.data.id);
    store.dispatch(addAvatar(response.data.avatar));
    store.dispatch(addFullname(response.data.fullname));
    store.dispatch(addUserId(response.data.id));
    return response;
  },
  GetInfoUserGitByAccesToken: () => async () => {
    const response = await axiosServer.post(`git/user-git-token`);
    return response;
  },
  GetReposGitByAccessToken: () => async () => {
    const response = await axiosServer.post(`git/repos-git-token`);
    return response.data;
  },

  GetBranchesByAccessToken: (repository) => async () => {
    const response = await axiosServer.post(`git/branches`, {
      repository: repository,
    });
    return response.data;
  },
  GetLanguagesByAccessToken: (repository) => async () => {
    const response = await axiosServer.post(`git/languages`, {
      repository: repository,
    });
    return response.data;
  },
  GetPathFileDockerByAccessToken: (repository, branch) => async () => {
    const response = await axiosServer.post(`git/paths-file-docker`, {
      repository: repository,
      branch: branch,
    });
    return response;
  },
  GetContentsByAccessToken: (repository, sha) => async () => {
    const response = await axiosServer.post(`git/content-file`, {
      repository: repository,
      sha: sha,
    });
    return response;
  },
};
export default githubApi;
