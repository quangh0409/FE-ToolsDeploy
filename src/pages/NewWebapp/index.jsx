import { Button, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MenuCustom, { getItem } from "../../components/MenuCustom";
import { UserOutlined } from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import {
  GetBranchesByAccessToken,
  GetLanguagesByAccessToken,
} from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";

export default function Newwebapp() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const repo = params.get("repo");
  const [dockerFileName, setDockerFileName] = useState("");
  const [branches, setBranches] = useState([{}]);
  const [languages, setLanguages] = useState([{}]);
  const [dockerComposeName, setDockerComposeName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setDockerFileName(e.target.value);
  };
  const handleModalshow = () => {
    setIsModalOpen(true);
  };

  const handleClearValueDockerFileName = () => {
    setDockerFileName("");
  };
  const handleValueDCChange = (e) => {
    setDockerComposeName(e.target.value);
  };

  const handleClearValueDC = () => {
    setDockerComposeName("");
  };

  useEffectOnce(() => {
    const fetchBranch = async () => {
      const res = await GetBranchesByAccessToken(
        "",
        localStorage.getItem(repo)
      );
      setBranches(res);
    };

    const fetchLanguage = async () => {
      const res = await GetLanguagesByAccessToken(
        "",
        localStorage.getItem(repo)
      );
      console.log("🚀 ~ fetchLanguage ~ res:", res);
      setLanguages(res);
    };
    fetchBranch();
    fetchLanguage();
  });
  console.log(languages);
  const numberConfigure = [
    "name",
    "branch",
    "architectura",
    "language",
    "dockerfile",
    "docker_conpose",
  ];

  const itemsLanguage =
    Array.isArray(languages) &&
    languages.map(({ language }) => {
      return {
        value: language,
        lable: language,
      };
    });
  const itemsBranch =
    Array.isArray(branches) &&
    branches.map(({ branch }) => {
      return {
        value: branch,
        lable: branch,
      };
    });
  const itemsArchitectura = [
    { value: "Microservice (monorepo)", lable: "Microservice (monorepo)" },
    { value: "Monolithic", lable: "Monolithic" },
  ];
  const onSelect = (e) => {
    console.log(e);
  };
  return (
    <>
      <div>
        <div className="ml-20 max-h-max">
          <h2 className="text-3xl mt-5">
            You are deploying a web service for{" "}
            <a href={repo} className="underline">
               quangh0409/service_project
            </a>
            .
          </h2>
          <div className="border border-solid border-black w-11/12 h-full ">
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Name</h2>
              </div>
              <div className="w-8/12 h-full">
                <Input className="h-full" placeholder="Name" />
              </div>
            </div>
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Branch</h2>
              </div>
              <div className="w-8/12 h-full ">
                <Select
                  placeholder={"no choice"}
                  className="w-full h-full rounded-lg "
                  onChange={onSelect}
                  options={itemsBranch}
                />
              </div>
            </div>
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Architectura</h2>
              </div>
              <div className="w-8/12 h-full">
                <Select
                  placeholder={"no choice"}
                  //   defaultValue={"no choice"}
                  className="w-full h-full rounded-lg "
                  onChange={onSelect}
                  options={itemsArchitectura}
                />
              </div>
            </div>
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Language</h2>
              </div>
              <div className="w-8/12 h-full ">
                <Select
                  placeholder={"no choice"}
                  className="w-full h-full rounded-lg "
                  onChange={onSelect}
                  options={itemsLanguage}
                />
              </div>
            </div>
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Dockerfile</h2>
              </div>
              <div className="w-8/12 h-full ">
                <Input
                  className="h-full"
                  placeholder={"defult"}
                  readOnly
                  value={dockerFileName}
                  onChange={handleInputChange}
                  //   allowClear
                  suffix={
                    <Button
                      className="text-gray-400 pointer-events-auto  "
                      onClick={handleModalshow}
                    >
                      Edit
                    </Button>
                  }
                />
                <Modal
                  open={isModalOpen}
                  footer={false}
                  onCancel={() => setIsModalOpen(false)}
                  width={1000}
                  closeIcon={false}
                >
                  <TemplateDetailPage />
                  <div className="flex justify-between mt-5">
                    <div className="flex ">
                      <Button
                        className="mr-3"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Scan
                      </Button>
                      <Button onClick={() => setIsModalOpen(false)}>
                        Save
                      </Button>
                    </div>
                    <Button onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Docker-compose</h2>
              </div>
              <div className="w-8/12 h-full ">
                <Input
                  className="h-full"
                  placeholder={"defult"}
                  readOnly
                  value={dockerComposeName}
                  onChange={handleValueDCChange}
                  //   allowClear
                  suffix={
                    <Button
                      className="text-gray-400 pointer-events-auto  "
                      onClick={handleClearValueDC}
                    >
                      Edit
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-20">
            <Button
              className="text-green-400 pointer-events-auto border border-solid border-green-400  "
              onClick={handleClearValueDC}
            >
              Deploy Web service
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
