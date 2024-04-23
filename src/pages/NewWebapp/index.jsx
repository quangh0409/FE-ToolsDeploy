import { Button, Card, Form, Input, Modal, Radio, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import githubApi from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";
import { useSelector } from "react-redux";
import vmsApi from "../../apis/vms.api";
import { store } from "../../redux/store";
import { addService } from "../../redux/reducer/user";
import scanApi from "../../apis/scan.api";
import apiCaller from "../../apis/apiCaller";

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
  const [contentfile, setContentfile] = useState();
  const [resultScanSyntax, setResultScanSyntax] = useState();
  const [errorLine, setErrorLine] = useState();
  const [serviceId, setServiceId] = useState();
  const [env, setEnv] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEnv, setIsModalOpenEnv] = useState(false);
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
      docker_file: [],
      docker_compose: [],
    },
  ]);

  const [dockerConfig, setDockerConfig] = useState([
    {
      docker_file: [],
      docker_compose: [],
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
  }, [loading, dockerConfig]);

  useEffect(() => {
    if (vms_ids.length > 0) {
      const fetch = async () => {
        const res = await apiCaller({
          request: vmsApi.getVmsByIds(vms_ids),
        });
        setVms(res);
      };
      fetch();
    }
  }, [vms_ids]);

  useEffectOnce(() => {
    const fetchBranch = async () => {
      // const res = await GetBranchesByAccessToken(repo);
      const res = await apiCaller({
        request: githubApi.GetBranchesByAccessToken(repo),
      });
      setBranches(res);
    };

    const fetchLanguage = async () => {
      const res = await apiCaller({
        request: githubApi.GetLanguagesByAccessToken(repo),
      });
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
        docker_file: [],
        docker_compose: [],
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
  const check = () => {
    form.validateFields();
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
            <Form
              form={form}
              onFinish={() => {
                console.log("ok");
              }}
              initialValues={{ items: [{}] }}
            >
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
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your host!",
                                },
                              ]}
                              label={"Name"}
                              name={"Name"}
                            >
                              <Input
                                value={environments[index].name}
                                onChange={(e) => {
                                  environments[index].name = e.target.value;
                                  setEnvironments([...environments]);
                                }}
                              />
                            </Form.Item>
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
                                  const docker = await apiCaller({
                                    request:
                                      githubApi.GetPathFileDockerByAccessToken(
                                        repo,
                                        v
                                      ),
                                  });
                                  // dockerConfig[index]?.docker_file.push(
                                  //   ...docker.dockerfile
                                  // );
                                  // dockerConfig[index]?.docker_compose.push(
                                  //   ...docker.docker_compose
                                  // );
                                  dockerConfig[index] = {
                                    docker_file: docker.dockerfile,
                                    docker_compose: docker.docker_compose,
                                  };
                                  setDockerConfig(dockerConfig);
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
                            <Select
                              mode="multiple"
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
                                      content: op.value,
                                    };
                                  }
                                );

                                setEnvironments([...environments]);
                              }}
                              options={dockerConfig[index]?.docker_file.map(
                                (d) => {
                                  return {
                                    label: d.name,
                                    value: d.content,
                                    desc: d.path,
                                    // con
                                  };
                                }
                              )}
                              optionRender={(option, info) => (
                                <Space className="flex justify-between">
                                  <div>
                                    <span
                                      role="img"
                                      aria-label={option.data.label}
                                    >
                                      {option.data.emoji}
                                    </span>
                                    {option.data.desc}
                                  </div>
                                  {option.data.desc && (
                                    <Button
                                      onClick={async (e) => {
                                        setIsModalOpen(true);
                                        setContentfile({
                                          name: option.data.desc,
                                          content: option.data.value,
                                        });
                                        e.stopPropagation();
                                      }}
                                    >
                                      {" "}
                                      Edit
                                    </Button>
                                  )}
                                </Space>
                              )}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Space
                                    className="w-full"
                                    style={{ padding: "8px 4px" }}
                                  >
                                    <Button
                                      type="text"
                                      icon={<PlusOutlined />}
                                      className="w-full"
                                      onClick={(e) => {
                                        setIsModalOpen(true);
                                        setContentfile({
                                          name: "",
                                          content: "",
                                          type: "DOCKERFILE",
                                        });
                                        e.stopPropagation();
                                      }}
                                    >
                                      Add item
                                    </Button>
                                  </Space>
                                </>
                              )}
                            />
                            <Modal
                              open={isModalOpen}
                              footer={false}
                              onCancel={() => setIsModalOpen(false)}
                              closeIcon={false}
                              width={1500}
                            >
                              <TemplateDetailPage
                                contentfile={contentfile}
                                setContentfile={setContentfile}
                                resultScanSyntax={resultScanSyntax}
                                errorLine={errorLine}
                              />
                              <div className="flex justify-between mt-5">
                                <div className="flex ">
                                  <Button
                                    className="mr-3"
                                    onClick={async () => {
                                      const res = await apiCaller({
                                        request: scanApi.scanSyxtax(
                                          contentfile.content
                                        ),
                                      });
                                      const lines = res.map((val) => {
                                        if (val.level === "error")
                                          return val.line;
                                      });
                                      setErrorLine(lines);
                                      setResultScanSyntax(res);
                                    }}
                                  >
                                    Scan
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (
                                        !contentfile?.name ||
                                        contentfile?.name === ""
                                      ) {
                                        alert("Please enter name file");
                                      } else {
                                        const check = dockerConfig[
                                          index
                                        ].docker_file?.findIndex((f, idx) => {
                                          console.log(f.path);
                                          if (contentfile.name === f.path) {
                                            dockerConfig[index].docker_file[
                                              idx
                                            ].content = contentfile.content;
                                            return true;
                                          }
                                        });

                                        if (check !== 0) {
                                          const t = contentfile.name.split("/");
                                          dockerConfig[index].docker_file.push({
                                            name: t[t.length - 1],
                                            path: contentfile.name,
                                            content: contentfile.content,
                                          });
                                        }
                                        setIsModalOpen(false);
                                      }
                                    }}
                                  >
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
                                      content: op.value,
                                    };
                                  }
                                );

                                setEnvironments([...environments]);
                              }}
                              options={dockerConfig[index]?.docker_compose.map(
                                (d) => {
                                  return {
                                    label: d.name,
                                    value: d.content,
                                    desc: d.path,
                                  };
                                }
                              )}
                              optionRender={(option) => (
                                <Space className="flex justify-between">
                                  <div>
                                    <span
                                      role="img"
                                      aria-label={option.data.label}
                                    >
                                      {option.data.emoji}
                                    </span>
                                    {option.data.desc}
                                  </div>
                                  {option.data.desc && (
                                    <Button
                                      onClick={(e) => {
                                        setIsModalOpen(true);
                                        setContentfile({
                                          name: option.data.desc,
                                          content: option.data.value,
                                        });
                                        e.stopPropagation();
                                      }}
                                    >
                                      {" "}
                                      Edit
                                    </Button>
                                  )}
                                </Space>
                              )}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Space
                                    className="w-full"
                                    style={{ padding: "8px 4px" }}
                                  >
                                    <Button
                                      type="text"
                                      icon={<PlusOutlined />}
                                      className="w-full"
                                      onClick={(e) => {
                                        setIsModalOpen(true);
                                        e.stopPropagation();
                                      }}
                                    >
                                      Add item
                                    </Button>
                                  </Space>
                                </>
                              )}
                            />
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Postman</h2>
                          </div>
                          <div className="w-8/12 h-full ">tải file</div>
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
              disabled={false}
              onClick={() => {
                const fetch = async () => {
                  const res = await apiCaller({
                    request: vmsApi.createService({
                      ...service,
                      environments: environments,
                    }),
                  });

                  console.log(res);
                };
                check();
                form.submit();
                // fetch();

                // navigate(`/service?vm=${vm}`);
                // console.log({
                //   ...service,
                //   environments: environments,
                // });
              }}
            >
              Save
            </Button>
            <Button
              className="text-gray-400 pointer-events-auto border border-solid border-gray-400  "
              onClick={() => {
                let res;
                const fetch = async () => {
                  res = await apiCaller({
                    request: vmsApi.createService({
                      ...service,
                      environments: environments,
                    }),
                  });
                  setServiceId(res.id);
                };
                fetch();
                if (environments.length === 1) {
                  navigate(
                    `/ocean?service=${res.id}&env=${environments[0].name}`
                  );
                } else {
                  setIsModalOpenEnv(true);
                }
                console.log(environments);
              }}
            >
              Build
            </Button>
          </div>
        </div>
        <Modal
          open={isModalOpenEnv}
          onCancel={() => setIsModalOpenEnv(false)}
          closeIcon={true}
          title={"Environment"}
        >
          <div className="grid-flow-row">
            <div className="mb-2">
              <Radio.Group
                onChange={(e) => {
                  setEnv(e.target.value);
                }}
              >
                {environments.map((val, idx) => {
                  console.log("🚀 ~ {environments.map ~ val:", val);
                  return (
                    <Radio key={idx} value={val.name}>
                      {val.name}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
            <div className="">
              <Button
                onClick={() => {
                  navigate(`/ocean?service=${serviceId}&env=${env}`);
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
