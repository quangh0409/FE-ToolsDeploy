import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import useEffectOnce from "../../hook/useEffectOnce";
import {
  GetInfoUserGitByAccesToken,
  GetReposGitByAccessToken,
} from "../../apis/github.api";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ConnectGit() {
  const [repos, setRepos] = useState([]);
  const [repoName, setRepoName] = useState();
  const [userGit, setUseGit] = useState();
  const [tokenStatus, setTokenStatus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  useEffect(() => {
    const fecth = async () => {
      const response = await GetInfoUserGitByAccesToken();
      setUseGit(response.login);
      const repositorys = await GetReposGitByAccessToken();
      setRepos(repositorys);
      // }
    };
    fecth();
  }, []);
  // setTokenStatus(false);

  const handleInputChange = (e) => {
    setRepoName(e.target.value);
  };

  const handleClearInput = () => {
    setRepoName("");
  };
  return (
    <>
      <div className="grid grid-cols-3 w-svw h-screen">
        <div className="col-span-2 ml-20 h-full">
          <div>
            <h2 className="text-3xl mt-10">Create a new Web Service</h2>
            <h2>
              Connect your Git repository or use an existing public repository
              URL.
            </h2>
          </div>
          <div className="p-2 border border-solid border-gray-400 rounded-lg h-fit mt-14 ">
            <div>
              <div>
                <h2 className="text-2xl mb-3">Connect a repository</h2>
              </div>
              <Input
                placeholder="Enter your username"
                prefix={
                  <SearchOutlined
                    className="site-form-item-icon"
                    onClick={() => {}}
                  />
                }
                value={repoName}
                onChange={handleInputChange}
                //   allowClear
                suffix={
                  <Button
                    className="text-gray-400 pointer-events-auto border-0 "
                    onClick={handleClearInput}
                  >
                    Clear
                  </Button>
                }
              />
            </div>
            <div className="border-solid mt-2 border-gray-400 rounded-lg max-h-96 scroll-mx-2 overflow-auto">
              {repos.map((repo, idx) => {
                return (
                  <div
                    className="flex flex-row h-12 border border-solid border-gray-400 items-center justify-between"
                    key={idx}
                  >
                    <div className=" h-full flex flex-row items-center ">
                      <img
                        className="h-full"
                        src="/images/github.png"
                        alt="logo"
                      />
                      <div className="underline ">
                        <a href={repo.html_url}>{repo.full_name}</a>
                      </div>
                    </div>
                    <Button
                      className=" pointer-events-auto text-blue-500"
                      onClick={() => {
                        navigate(
                          `/new-webapp?repo=${repo.name}&user=${repo.owner.login}&clone_url=${repo.clone_url}&vm=${vm}`
                        );
                      }}
                    >
                      connect
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-span-1"> ds</div>
      </div>
    </>
  );
}
