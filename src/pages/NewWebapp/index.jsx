import { Button, Card, Form, Input, Modal, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import {
  GetBranchesByAccessToken,
  GetLanguagesByAccessToken,
  GetPathFileDockerByAccessToken,
} from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";
import { useSelector } from "react-redux";
import { createService, getVmsByIds } from "../../apis/vms.api";
import { store } from "../../redux/store";
import { addService } from "../../redux/reducer/user";

export default function Newwebapp() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const repo = params.get("repo");
  const user = params.get("user");
  const source = params.get("clone_url");
  const vm = params.get("vm");

  const [branches, setBranches] = useState([{}]);
  const [languages, setLanguages] = useState([{}]);
  const [vms, setVms] = useState([]);
  const [service, setService] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const service_t = useSelector((state) => state.user.service);

  const [form] = Form.useForm();

  const [inputValue, setInputValue] = useState("");
  const [environments, setEnvironments] = useState([
    {
      name: "",
      vm: "",
      branch: "",
      docker_file: {},
      docker_compose: {},
    },
  ]);

  const [dockerConfig, setDockerConfig] = useState([
    {
      docker_file: [
        {
          name: "",
          path: "",
          sha: "",
        },
      ],
      docker_compose: [
        {
          name: "",
          path: "",
          sha: "",
        },
      ],
    },
  ]);
  const handleModalshow = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setService(service_t);
    store.dispatch(addService({ repo: repo, source: source }));
  }, [service_t, repo, source]);

  useEffect(() => {
    setDockerConfig(dockerConfig);
    setLoading(false);
  }, [loading]);

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

  const handleAddEnvironment = (add) => {
    if (inputValue.trim() !== "") {
      add();
      const env = {
        name: inputValue,
        vm: "",
        branch: "",
        docker_file: {},
        docker_compose: {},
      };
      setEnvironments([...environments, env]);
      setInputValue(""); // Clear input after adding
    }
  };
  const handleRemoveCard = (remove, index) => {
    remove(index);
    const newEnvs = [...environments];
    newEnvs.splice(index, 1);
    setEnvironments(newEnvs);
  };
  return (
    <>
      <div>
        <div className="ml-20 max-h-max">
          <h2 className="text-3xl mt-5">
            You are deploying a web service for{" "}
            <a href={source} className="underline">
               {`${user}/${repo}`}
            </a>
            .
          </h2>
          <div className=" w-11/12 h-full ">
            {/* -------------------------------- */}
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Name</h2>
              </div>
              <div className="w-8/12 h-full">
                <Input
                  className="h-full"
                  placeholder="Name"
                  onChange={(e) => {
                    store.dispatch(addService({ name: e.target.value }));
                  }}
                />
              </div>
            </div>
            {/* -------------------------------- */}
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Architectura</h2>
              </div>
              <div className="w-8/12 h-full">
                <Select
                  placeholder={"no choice"}
                  //   defaultValue={"no choice"}
                  className="w-full h-full rounded-lg "
                  onChange={(value) => {
                    store.dispatch(addService({ architectura: value }));
                  }}
                  options={itemsArchitectura}
                />
              </div>
            </div>
            {/* -------------------------------- */}
            <div className="flex flex-row w-full h-12  justify-between mb-5">
              <div className="h-full">
                <h2>Language</h2>
              </div>
              <div className="w-8/12 h-full ">
                <Select
                  placeholder={"no choice"}
                  className="w-full h-full rounded-lg "
                  onChange={(value) => {
                    store.dispatch(addService({ language: value }));
                  }}
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
                        title={"Environment: " + environments[index].name}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => handleRemoveCard(remove, index)}
                          />
                        }
                      >
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Name</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Input
                              value={environments[index].name}
                              onChange={(e) => {
                                environments[index].name = e.target.value;
                                setEnvironments([...environments]);
                              }}
                            />
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>VM instance</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Select
                              placeholder={"no choice"}
                              className="w-full h-full rounded-lg "
                              onChange={(v, op) => {
                                environments[index].vm = op.lable;

                                setEnvironments([...environments]);
                              }}
                              options={itemsVM}
                            />
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Branch</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Select
                              placeholder={"no choice"}
                              className="w-full h-full rounded-lg "
                              onChange={(v, op) => {
                                environments[index].branch = v;
                                setEnvironments([...environments]);
                                const fetch = async () => {
                                  const docker =
                                    await GetPathFileDockerByAccessToken(
                                      repo,
                                      v
                                    );
                                  dockerConfig[index] = {
                                    docker_file: docker.dockerfile,
                                    docker_compose: docker.docker_compose,
                                  };
                                  // setDockerConfig(dockerConfig);
                                  setLoading(true);
                                };
                                fetch();
                              }}
                              options={itemsBranch}
                            />
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Dockerfile</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            {/* <Input
                              className="h-full"
                              placeholder={"defult"}
                              value={environments[index].docker_file.name}
                              onChange={(e) => {
                                environments[index].docker_file.name =
                                  e.target.value;

                                setEnvironments([...environments]);
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
                            /> */}
                            <Select
                              mode="tags"
                              style={{
                                width: "100%",
                              }}
                              // placeholder="select one country"
                              // defaultValue={["china"]}
                              onChange={(value, ops) => {
                                console.log(ops);
                                environments[index].docker_file = ops.map(
                                  (op) => {
                                    return {
                                      location: op.desc,
                                      name: op.label,
                                      content: "",
                                    };
                                  }
                                );

                                setEnvironments([...environments]);
                              }}
                              options={dockerConfig[index].docker_file.map(
                                (d) => {
                                  return {
                                    label: d.name,
                                    value: d.sha,
                                    desc: d.path,
                                  };
                                }
                              )}
                              optionRender={(option) => (
                                <Space>
                                  <span
                                    role="img"
                                    aria-label={option.data.label}
                                  >
                                    {option.data.emoji}
                                  </span>
                                  {option.data.desc}
                                </Space>
                              )}
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
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Docker-compose</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            {/* <Input
                              className="h-full"
                              placeholder={"defult"}
                              value={environments[index].docker_compose.name}
                              onChange={(e) => {
                                environments[index].docker_compose.name =
                                  e.target.value;

                                setEnvironments([...environments]);
                              }}
                              suffix={
                                <Button
                                  className="text-gray-400 pointer-events-auto  "
                                  onClick={handleModalshow}
                                >
                                  Edit
                                </Button>
                              }
                            /> */}
                            <Select
                              mode="multiple"
                              style={{
                                width: "100%",
                              }}
                              // placeholder="select one country"
                              // defaultValue={["china"]}
                              onChange={(value, ops) => {
                                console.log(ops);
                                environments[index].docker_compose = ops.map(
                                  (op) => {
                                    return {
                                      location: op.desc,
                                      name: op.label,
                                      content: "",
                                    };
                                  }
                                );

                                setEnvironments([...environments]);
                              }}
                              options={dockerConfig[index].docker_compose.map(
                                (d) => {
                                  return {
                                    label: d.name,
                                    value: d.sha,
                                    desc: d.path,
                                  };
                                }
                              )}
                              optionRender={(option) => (
                                <Space>
                                  <span
                                    role="img"
                                    aria-label={option.data.label}
                                  >
                                    {option.data.emoji}
                                  </span>
                                  {option.data.desc}
                                </Space>
                              )}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    {/* -------------------------------- */}
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
          {/* -------------------------------- */}
          <div className="mt-20 flex gap-3">
            <Button
              className="text-green-400 pointer-events-auto border border-solid border-green-400  "
              onClick={() => {
                const fetch = async () => {
                  const res = await createService({
                    ...service,
                    environments: environments,
                  });
                
                  console.log(res);
                };
                navigate(`/service?vm${vm}`);
                // fetch();
              }}
            >
              Save
            </Button>
            <Button
              className="text-gray-400 pointer-events-auto border border-solid border-gray-400  "
              onClick={() => {
                navigate("/ocean");
              }}
            >
              Build
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
