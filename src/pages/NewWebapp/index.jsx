import { Button, Card, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuCustom, { getItem } from "../../components/MenuCustom";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import {
  GetBranchesByAccessToken,
  GetLanguagesByAccessToken,
} from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";
import { useSelector } from "react-redux";
import { getVmsByIds } from "../../apis/vms.api";

export default function Newwebapp() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const repo = params.get("repo");
  const [dockerFileName, setDockerFileName] = useState([]);
  const [branches, setBranches] = useState([{}]);
  const [languages, setLanguages] = useState([{}]);
  const [dockerComposeName, setDockerComposeName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vms, setVms] = useState([]);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);

  const handleModalshow = () => {
    setIsModalOpen(true);
  };

  const handleClearValueDC = () => {
    setDockerComposeName("");
  };

  useEffect(() => {
    if (vms_ids.length > 0) {
      const fetch = async () => {
        const res = await getVmsByIds(vms_ids);
        setVms(res);
      };
      fetch();
    }
  }, [vms_ids]);

  useEffectOnce(() => {
    const token = localStorage.getItem("token");
    const fetchBranch = async () => {
      const res = await GetBranchesByAccessToken(repo);
      setBranches(res);
    };

    const fetchLanguage = async () => {
      const res = await GetLanguagesByAccessToken(repo);
      setLanguages(res);
    };
    fetchBranch();
    fetchLanguage();
  });

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

  const itemsVM =
    Array.isArray(vms) &&
    vms.map((vm) => {
      return {
        value: vm?.host,
        lable: vm?.id,
      };
    });

  const itemsArchitectura = [
    { value: "Microservice (monorepo)", lable: "Microservice (monorepo)" },
    { value: "Monolithic", lable: "Monolithic" },
  ];
  const onSelect = (value, options) => {
    console.log(options.lable);
  };
  const [form] = Form.useForm();

  const [inputValue, setInputValue] = useState("");
  const [environmentNames, setEnvironmentNames] = useState([""]);

  const handleAddEnvironment = (add) => {
    if (inputValue.trim() !== "") {
      add();
      setEnvironmentNames([...environmentNames, inputValue]);
      setInputValue(""); // Clear input after adding
    }
  };
  const handleRemoveCard = (remove, index) => {
    remove(index);
    const newNames = [...environmentNames];
    newNames.splice(index, 1);
    setEnvironmentNames(newNames);
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
          <div className=" w-11/12 h-full ">
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
            <Form form={form} initialValues={{ items: [{}] }}>
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      rowGap: 16,
                      flexDirection: "column",
                    }}
                  >
                    {fields.map((field, index) => (
                      <Card
                        size="small"
                        title={"Environment: " + environmentNames[index]}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => handleRemoveCard(remove, index)}
                          />
                        }
                      >
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Name</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Input
                              value={environmentNames[index]}
                              onChange={(e) => {
                                environmentNames[index] = e.target.value;
                                setEnvironmentNames([...environmentNames]);
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>VM instance</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Select
                              placeholder={"no choice"}
                              className="w-full h-full rounded-lg "
                              onChange={onSelect}
                              options={itemsVM}
                            />
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
                            <h2>Dockerfile</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Input
                              className="h-full"
                              placeholder={"defult"}
                              value={dockerFileName[index]}
                              onChange={(e) => {
                                dockerFileName[index] = e.target.value;
                                setDockerFileName([...dockerFileName]);
                              }}
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
                              value={dockerComposeName[index]}
                              onChange={(e) => {
                                dockerComposeName[index] = e.target.value;
                                setDockerComposeName([...dockerComposeName]);
                              }}
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
                      </Card>
                    ))}
                    <div className="flex items-center">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={() => handleAddEnvironment(add)}
                        placeholder="Enter environment name"
                        style={{ marginRight: 8 }}
                      />
                      <Button
                        type="dashed"
                        onClick={() => handleAddEnvironment(add)}
                        block
                      >
                        Add Environment
                      </Button>
                    </div>
                  </div>
                )}
              </Form.List>
            </Form>
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
