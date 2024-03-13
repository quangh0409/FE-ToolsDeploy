import axios from "axios";
import axiosServer from "./axios";

const axiosGithub = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    // Authorization: "06d79c269a199ee33aa0",
    Accept: "application/json",
  },
});

export async function loginWithGithub(auth) {
  //   const header = btoa(username + ":" + password);

  const response = await axiosGithub.post(
    "/user?client_id=d07893f17582c895aefd"
    //   &client_secret=ed9bdfeacb15439ac04a4f314e7c35d83b1a5f67&code=06d79c269a199ee33aa0"
    //   {
    //     // headers: {
    //     //   Authorization: "Bearer" + header,
    //     // },
    //   }
  );

  console.log(response);
}

export async function getAccessToken(code) {
  const response = await axiosServer().get(`auth/callback?code=${code}`);
  console.log(response);
  return response.data.data.access_token;
}

export async function GetReposGitByAccessToken(user) {
  const response = await axiosServer().post(`users/repos-git-token`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
  });

  return response.data;
}

export async function GetBranchesByAccessToken(user, repository) {
  const response = await axiosServer().post(`users/branches`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
    repository: localStorage.getItem("repo"),
  });

  return response.data.data;
}

export async function GetLanguagesByAccessToken(user, repository) {
  const response = await axiosServer().post(`users/languages`, {
    token: localStorage.getItem("access-token-git"),
    user: "quangh0409",
    repository: localStorage.getItem("repo"),
  });

  return response.data.data;
}

