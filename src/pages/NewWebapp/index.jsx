import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Upload,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import githubApi from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";
import { useDispatch, useSelector } from "react-redux";
import vmsApi from "../../apis/vms.api";
import { store } from "../../redux/store";
import {
  addService,
  setEnvironments,
  setTourWebapp,
} from "../../redux/reducer/user";
import scanApi from "../../apis/scan.api";
import apiCaller from "../../apis/apiCaller";
import { message } from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Tour } from "antd";
export default function Newwebapp() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const repo = params.get("repo");
  const user = params.get("user");
  const source = params.get("clone_url");
  const vm = params.get("vm");
  const service_id = params.get("service");

  const tourWebapp = useSelector((state) => state.user?.tour?.webApp);

  const refCaseSecond1 = useRef(null);
  const refCaseSecond2 = useRef(null);
  const refCaseSecond3 = useRef(null);
  const refCaseSecond4 = useRef(null);
  const refCaseSecond5 = useRef(null);
  const refCaseSecond6 = useRef(null);
  const refCaseSecond7 = useRef(null);
  const refCaseSecond8 = useRef(null);
  const refCaseSecond9 = useRef(null);
  const refCaseSecond10 = useRef(null);
  const refCaseSecond11 = useRef(null);
  const refCaseSecond12 = useRef(null);

  const stepsCaseSecond = [
    {
      title: "Name WeppApp",
      description: "Enter name webapp",
      target: () => refCaseSecond1.current,
    },
    {
      title: "Architecture",
      description: "Choose architecture",
      target: () => refCaseSecond2.current,
    },
    {
      title: "Language",
      description: "Choose language",
      target: () => refCaseSecond3.current,
    },
    {
      title: "Environment name",
      description: "Enter emv name",
      target: () => refCaseSecond4.current,
    },
    {
      title: "VM-instance",
      description: "Choose VM-instance for deploy",
      target: () => refCaseSecond5.current,
    },
    {
      title: "Branch",
      description: "Choose branch",
      target: () => refCaseSecond6.current,
    },
    {
      title: "Dockerfile",
      description: "Choose Dockerfile",
      target: () => refCaseSecond7.current,
    },
    {
      title: "docker-compose",
      description: "Choose docker-compose.yaml",
      target: () => refCaseSecond8.current,
    },
    {
      title: "Postman",
      description: "Upload file test api after deploy",
      target: () => refCaseSecond9.current,
    },
    {
      title: "Add environment",
      description: "This function allows you to add a deployment environment",
      target: () => refCaseSecond10.current,
    },
    {
      title: "Save",
      description:
        "This function only saves the information you filled in above, but does not execute the pipeline",
      target: () => refCaseSecond11.current,
    },
    {
      title: "Build",
      description:
        "This function simultaneously saves the above information and runs the CI/CD pipeline",
      target: () => refCaseSecond12.current,
    },
  ];

  const [branches, setBranches] = useState([{}]);
  const [languages, setLanguages] = useState([{}]);
  const [vms, setVms] = useState([]);
  const [vmsT, setVmsT] = useState([]);
  const [service, setService] = useState();
  const [contentfile, setContentfile] = useState();
  const [resultScanSyntax, setResultScanSyntax] = useState();
  const [errorLine, setErrorLine] = useState();
  const [serviceId, setServiceId] = useState();
  const [env, setEnv] = useState();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEnv, setIsModalOpenEnv] = useState(false);
  const [loading, setLoading] = useState(false);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const service_t = useSelector((state) => state.user.service);
  const [fields, setFields] = useState();
  const [form] = Form.useForm();

  const environments = useSelector((state) => state.user.environments);
  console.log("🚀 ~ Newwebapp ~ environments:", environments);

  const [dockerConfig, setDockerConfig] = useState([
    {
      docker_file: [],
      docker_compose: [],
    },
  ]);

  useEffect(() => {
    setService(service_t);
    store.dispatch(addService({ repo: repo, source: source }));
  }, [service_t, repo, source]);

  const exportData = (content, filename) => {
    const jsonString = `data:application/json;chatset=utf-8,${atob(content)}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}`;

    link.click();
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(res);
      store.dispatch(addService({ name: res.name }));
      store.dispatch(addService({ architectura: res.architectura }));
      store.dispatch(addService({ language: res.language }));
      const items = [];
      res.environment.forEach((env, idx) => {
        items.push(
          {
            name: ["items", idx, "name_env"],
            value: env.name,
          },
          {
            name: ["items", idx, "vm_instance"],
            value: env.vm.host,
          },
          {
            name: ["items", idx, "branch"],
            value: env.branch,
          },
          {
            name: ["items", idx, "dockerfile"],
            value: env.docker_file.map((file) => file.name),
          },
          {
            name: ["items", idx, "docker_compose"],
            value: env.docker_compose.map((file) => file.name),
          }
        );
      });

      store.dispatch(setEnvironments(res.environment));
      setDockerConfig(
        res.environment.map((env) => ({
          docker_file: env.docker_file,
          docker_compose: env.docker_compose,
        }))
      );
      setFields([
        {
          name: ["name_service"],
          value: res.name,
        },
        {
          name: ["Architectura"],
          value: res.architectura,
        },
        {
          name: ["language"],
          value: res.language,
        },
        ...items,
      ]);
    };
    if (service_id) {
      fetch();
    }
  }, [service_id]);

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
        setVmsT(res);
      };
      fetch();
    }
  }, [vms_ids]);

  useEffectOnce(() => {
    const fetchBranch = async () => {
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
    add();
    const env = [
      {
        name: "",
        vm: "",
        branch: "",
        docker_file: [],
        docker_compose: [],
        postman: {
          collection: {},
          environment: {},
        },
      },
    ];
    store.dispatch(setEnvironments([...environments, env]));
  };
  const handleRemoveCard = (remove, index) => {
    remove(index);
    const vmsr = vmsT.find((vm) => vm.id === environments[index]?.vm);
    setVms([...vms, vmsr]);
    const newEnvs = [...environments];
    newEnvs.splice(index, 1);
    store.dispatch(setEnvironments([...newEnvs]));
  };
  const propsC = {
    // name: "file",
    action: "//jsonplaceholder.typicode.com/posts/",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const propsE = {
    name: "file",
    action: "//jsonplaceholder.typicode.com/posts/",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    // fileListE,
  };
  return (
    <>
      <Tour
        open={tourWebapp}
        mask={false}
        type="primary"
        onClose={() => {
          store.dispatch(setTourWebapp(false));
        }}
        onFinish={() => {
          store.dispatch(setTourWebapp(false));
        }}
        steps={stepsCaseSecond}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
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
            <Form
              form={form}
              fields={fields}
              onFinish={() => {
                const fetchC = async () => {
                  const res = await apiCaller({
                    request: vmsApi.createService({
                      ...service,
                      environments: environments,
                    }),
                  });
                  if (res) {
                    navigate(`/vm-instance?vm=${environments[0].vm}`);
                  }
                };
                const fetchU = async () => {
                  const res = await apiCaller({
                    request: vmsApi.updateService(
                      {
                        ...service,
                        environment: undefined,
                        id: undefined,
                        environments: environments.map((env) => {
                          return {
                            ...env,
                            vm: env.vm.id,
                          };
                        }),
                      },
                      service_id
                    ),
                  });
                  if (res) {
                    navigate(`/vm-instance?vm=${environments[0].vm.id}`);
                  }
                };
                service_id ? fetchU() : fetchC();

                console.log({
                  ...service,
                  environments: environments,
                });
              }}
              initialValues={{
                items: [{}],
              }}
            >
              <div className="flex flex-row w-full h-12  justify-between mb-5">
                <div className="h-full">
                  <h2 ref={refCaseSecond1}>Name</h2>
                </div>
                <div className="w-8/12 h-full">
                  <Form.Item
                    // label="name_service"
                    name="name_service"
                    rules={[
                      { required: true, message: "Please input name service!" },
                    ]}
                  >
                    {/* -------------------------------- */}
                    <Input
                      className="h-full"
                      placeholder="Name"
                      // value={}
                      onChange={(e) => {
                        store.dispatch(addService({ name: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-row w-full h-12  justify-between mb-5">
                <div className="h-full">
                  <h2 ref={refCaseSecond2}>Architecture</h2>
                </div>
                <div className="w-8/12 h-full">
                  <Form.Item
                    //  label="Architectura"
                    name="Architectura"
                    rules={[
                      { required: true, message: "Please input architectura!" },
                    ]}
                  >
                    {/* -------------------------------- */}
                    <Select
                      placeholder={"no choice"}
                      //   defaultValue={"no choice"}
                      className="w-full h-full rounded-lg "
                      onChange={(value) => {
                        store.dispatch(addService({ architectura: value }));
                      }}
                      options={itemsArchitectura}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-row w-full h-12  justify-between mb-5">
                <div className="h-full">
                  <h2 ref={refCaseSecond3}>Language</h2>
                </div>
                <div className="w-8/12 h-full ">
                  <Form.Item
                    name="language"
                    rules={[
                      { required: true, message: "Please input architectura!" },
                    ]}
                  >
                    {/* -------------------------------- */}
                    <Select
                      placeholder={"no choice"}
                      className="w-full h-full rounded-lg "
                      onChange={(value) => {
                        store.dispatch(addService({ language: value }));
                      }}
                      options={itemsLanguage}
                    />
                  </Form.Item>
                </div>
              </div>

              <Form.List name="items">
                {(fields, { add, remove }) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map((field, index) => {
                        return (
                          <Card
                            size="small"
                            title={"Environment: " + environments[index]?.name}
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
                                <h2 ref={refCaseSecond4}>Name</h2>
                              </div>
                              <div className="w-8/12 h-full ">
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input your name environment!",
                                    },
                                  ]}
                                  // label={"Name"} name={"name"}
                                  name={[field.name, "name_env"]}
                                >
                                  <Input
                                    value={environments[index]?.name}
                                    onChange={(e) => {
                                      store.dispatch(
                                        setEnvironments([
                                          ...environments.map((env, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...env,
                                                name: e.target.value,
                                              };
                                            } else {
                                              return env;
                                            }
                                          }),
                                        ])
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                            {/* -------------------------------- */}
                            <div className="flex flex-row w-full h-12  justify-between mb-5">
                              <div className="h-full">
                                <h2 ref={refCaseSecond5}>VM instance</h2>
                              </div>
                              <div className="w-8/12 h-full ">
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input your VM instance!",
                                    },
                                  ]}
                                  // label={"Name"}
                                  name={[field.name, "vm_instance"]}
                                >
                                  <Select
                                    placeholder={"no choice"}
                                    className="w-full h-full rounded-lg "
                                    onChange={(v, op) => {
                                      setVms(
                                        vms.filter((vm) => vm?.id !== op.lable)
                                      );
                                      store.dispatch(
                                        setEnvironments([
                                          ...environments.map((env, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...env,
                                                vm: op.lable,
                                              };
                                            } else {
                                              return env;
                                            }
                                          }),
                                        ])
                                      );
                                    }}
                                    options={itemsVM}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                            {/* -------------------------------- */}
                            <div className="flex flex-row w-full h-12  justify-between mb-5">
                              <div className="h-full">
                                <h2 ref={refCaseSecond6}>Branch</h2>
                              </div>
                              <div className="w-8/12 h-full ">
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input your branch!",
                                    },
                                  ]}
                                  name={[field.name, "branch"]}
                                >
                                  <Select
                                    placeholder={"no choice"}
                                    className="w-full h-full rounded-lg "
                                    onChange={(v, op) => {
                                      store.dispatch(
                                        setEnvironments([
                                          ...environments.map((env, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...env,
                                                branch: v,
                                              };
                                            }
                                            return env;
                                          }),
                                        ])
                                      );
                                      const fetch = async () => {
                                        const docker = await apiCaller({
                                          request:
                                            githubApi.GetPathFileDockerByAccessToken(
                                              repo,
                                              v
                                            ),
                                        });
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
                                </Form.Item>
                              </div>
                            </div>
                            {/* -------------------------------- */}
                            <div className="flex flex-row w-full h-12  justify-between mb-5">
                              <div className="h-full">
                                <h2 ref={refCaseSecond7}>Dockerfile</h2>
                              </div>
                              <div className="w-8/12 h-full ">
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input your Dockerfile!",
                                    },
                                  ]}
                                  // label={"Name"}
                                  name={[field.name, "dockerfile"]}
                                >
                                  <Select
                                    mode="multiple"
                                    style={{
                                      width: "100%",
                                    }}
                                    onChange={(value, ops) => {
                                      store.dispatch(
                                        setEnvironments([
                                          ...environments.map((env, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...env,
                                                docker_file: ops.map((op) => {
                                                  return {
                                                    path: op.desc,
                                                    name: op.label,
                                                    content: op.value,
                                                  };
                                                }),
                                              };
                                            } else {
                                              return env;
                                            }
                                          }),
                                        ])
                                      );
                                    }}
                                    options={dockerConfig[
                                      index
                                    ]?.docker_file.map((d) => {
                                      return {
                                        label: d.name,
                                        value: d.content,
                                        desc: d?.path ? d?.path : d?.path,
                                      };
                                    })}
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
                                                type: "DOCKERFILE",
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
                                </Form.Item>
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
                                            if (
                                              contentfile?.type === "DOCKERFILE"
                                            ) {
                                              const check = dockerConfig[
                                                index
                                              ].docker_file?.findIndex(
                                                (f, idx) => {
                                                  if (
                                                    contentfile.name === f.path
                                                  ) {
                                                    setDockerConfig(
                                                      dockerConfig.map(
                                                        (dc, idx) => {
                                                          if (idx === index) {
                                                            const t =
                                                              contentfile.name.split(
                                                                "/"
                                                              );
                                                            return {
                                                              docker_compose:
                                                                dc.docker_compose,
                                                              docker_file:
                                                                dc.docker_file.map(
                                                                  (f, i) => {
                                                                    if (
                                                                      f.path ===
                                                                      contentfile.name
                                                                    ) {
                                                                      return {
                                                                        name: t[
                                                                          t.length -
                                                                            1
                                                                        ],
                                                                        path: contentfile.name,
                                                                        content:
                                                                          contentfile.content,
                                                                      };
                                                                    }
                                                                    return f;
                                                                  }
                                                                ),
                                                            };
                                                          }
                                                        }
                                                      )
                                                    );
                                                    return true;
                                                  }
                                                }
                                              );

                                              if (check !== 0) {
                                                const t =
                                                  contentfile.name.split("/");
                                                setDockerConfig(
                                                  dockerConfig.map(
                                                    (dc, idx) => {
                                                      if (idx === index) {
                                                        return {
                                                          docker_compose:
                                                            dc.docker_compose,
                                                          docker_file: [
                                                            ...dc.docker_file,
                                                            {
                                                              name: t[
                                                                t.length - 1
                                                              ],
                                                              path: contentfile.name,
                                                              content:
                                                                contentfile.content,
                                                            },
                                                          ],
                                                        };
                                                      }
                                                    }
                                                  )
                                                );
                                                // dockerConfig[
                                                //   index
                                                // ].docker_file.push({
                                                //   name: t[t.length - 1],
                                                //   location: contentfile.name,
                                                //   content: contentfile.content,
                                                // });
                                              }

                                              store.dispatch(
                                                setEnvironments([
                                                  ...environments.map(
                                                    (env, idx) => {
                                                      const dockerfile_t =
                                                        env?.docker_file?.map(
                                                          (file) => {
                                                            if (
                                                              file?.path ===
                                                              contentfile.name
                                                            ) {
                                                              return {
                                                                ...file,
                                                                content:
                                                                  contentfile.content,
                                                              };
                                                            }
                                                            return file;
                                                          }
                                                        );
                                                      if (idx === index) {
                                                        return {
                                                          ...env,
                                                          docker_file:
                                                            dockerfile_t,
                                                        };
                                                      } else {
                                                        return env;
                                                      }
                                                    }
                                                  ),
                                                ])
                                              );
                                            } else {
                                              const check = dockerConfig[
                                                index
                                              ].docker_compose?.findIndex(
                                                (f, idx) => {
                                                  if (
                                                    contentfile.name === f.path
                                                  ) {
                                                    setDockerConfig(
                                                      dockerConfig.map(
                                                        (dc, idx) => {
                                                          if (idx === index) {
                                                            const t =
                                                              contentfile.name.split(
                                                                "/"
                                                              );
                                                            return {
                                                              docker_file:
                                                                dc.docker_file,
                                                              docker_compose:
                                                                dc.docker_compose.map(
                                                                  (f, i) => {
                                                                    if (
                                                                      f.path ===
                                                                      contentfile.name
                                                                    ) {
                                                                      return {
                                                                        name: t[
                                                                          t.length -
                                                                            1
                                                                        ],
                                                                        path: contentfile.name,
                                                                        content:
                                                                          contentfile.content,
                                                                      };
                                                                    }
                                                                    return f;
                                                                  }
                                                                ),
                                                            };
                                                          }
                                                        }
                                                      )
                                                    );
                                                    return true;
                                                  }
                                                }
                                              );

                                              if (check !== 0) {
                                                const t =
                                                  contentfile.name.split("/");
                                                dockerConfig[
                                                  index
                                                ].docker_compose?.push({
                                                  name: t[t.length - 1],
                                                  path: contentfile.name,
                                                  content: contentfile.content,
                                                });
                                              }

                                              store.dispatch(
                                                setEnvironments([
                                                  ...environments.map(
                                                    (env, idx) => {
                                                      const dockerfile_t =
                                                        env?.docker_compose?.map(
                                                          (file) => {
                                                            if (
                                                              file?.path ===
                                                              contentfile.name
                                                            ) {
                                                              return {
                                                                ...file,
                                                                content:
                                                                  contentfile.content,
                                                              };
                                                            }
                                                            return file;
                                                          }
                                                        );
                                                      if (idx === index) {
                                                        return {
                                                          ...env,
                                                          docker_compose:
                                                            dockerfile_t,
                                                        };
                                                      } else {
                                                        return env;
                                                      }
                                                    }
                                                  ),
                                                ])
                                              );
                                            }

                                            setIsModalOpen(false);
                                          }
                                        }}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                    <Button
                                      onClick={() => {
                                        setIsModalOpen(false);
                                        setContentfile({
                                          name: "",
                                          content: "",
                                          type: "",
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </Modal>
                              </div>
                            </div>
                            {/* -------------------------------- */}
                            <div className="flex flex-row w-full h-12  justify-between mb-5">
                              <div className="h-full">
                                <h2 ref={refCaseSecond8}>Docker-compose</h2>
                              </div>
                              <div className="w-8/12 h-full ">
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input your Docker-compose!",
                                    },
                                  ]}
                                  // label={"Name"}
                                  name={[field.name, "docker_compose"]}
                                >
                                  <Select
                                    mode="multiple"
                                    style={{
                                      width: "100%",
                                    }}
                                    onChange={(value, ops) => {
                                      store.dispatch(
                                        setEnvironments([
                                          ...environments.map((env, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...env,
                                                docker_compose: ops.map(
                                                  (op) => {
                                                    return {
                                                      path: op.desc,
                                                      name: op.label,
                                                      content: op.value,
                                                    };
                                                  }
                                                ),
                                              };
                                            } else {
                                              return env;
                                            }
                                          }),
                                        ])
                                      );
                                    }}
                                    options={dockerConfig[
                                      index
                                    ]?.docker_compose.map((d) => {
                                      return {
                                        label: d.name,
                                        value: d.content,
                                        desc: d?.path ? d?.path : d?.path,
                                      };
                                    })}
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
                                                type: "DOCKERCOMPOSE",
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
                                                type: "DOCKERCOMPOSE",
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
                                </Form.Item>
                              </div>
                            </div>
                            {/* -------------------------------- */}
                            <div className="flex flex-row w-full h-20  justify-between mb-5">
                              <div className="h-full">
                                <h2 ref={refCaseSecond9}>Postman</h2>
                              </div>
                              <div className="w-8/12 ">
                                <div className="flex gap-2 m-2">
                                  <span className="col-span-1 w-[78px]">
                                    Collection
                                  </span>
                                  <Form.Item
                                    className="col-span-1 "
                                    name={[field.name, "postman_collection"]}
                                  >
                                    <Upload
                                      {...propsC}
                                      className="flex gap-4"
                                      defaultFileList={[
                                        {
                                          uid: index,
                                          name: environments[index]?.postman
                                            ?.collection?.name
                                            ? environments[index]?.postman
                                                ?.collection?.name
                                            : "",
                                          status: "done",

                                          percent: 33,
                                        },
                                      ]}
                                      fileList={[
                                        {
                                          uid: index,
                                          name: environments[index]?.postman
                                            ?.collection?.name
                                            ? environments[index]?.postman
                                                ?.collection?.name
                                            : "",
                                          status: "done",

                                          percent: 33,
                                        },
                                      ]}
                                      beforeUpload={(file) => {
                                        return new Promise((resolve) => {
                                          const reader = new FileReader();
                                          reader.readAsDataURL(file);
                                          reader.onload = (e) => {
                                            try {
                                              store.dispatch(
                                                setEnvironments([
                                                  ...environments?.map(
                                                    (env, i) => {
                                                      if (i === index) {
                                                        return {
                                                          ...environments[
                                                            index
                                                          ],
                                                          postman: {
                                                            ...environments[
                                                              index
                                                            ]?.postman,
                                                            collection: {
                                                              name: file.name,
                                                              content:
                                                                e.target.result.split(
                                                                  ","
                                                                )[1],
                                                            },
                                                          },
                                                        };
                                                      }
                                                      return env;
                                                    }
                                                  ),
                                                ])
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Lỗi khi đọc file JSON:",
                                                error
                                              );
                                            }
                                          };
                                        });
                                      }}
                                    >
                                      <Button>
                                        <Icon type="upload" /> Upload
                                      </Button>
                                    </Upload>
                                  </Form.Item>
                                  {environments[index]?.postman?.collection
                                    ?.content && (
                                    <Button
                                      onClick={(e) => {
                                        exportData(
                                          environments[index]?.postman
                                            ?.collection?.content,
                                          environments[index]?.postman
                                            ?.collection?.name
                                        );
                                      }}
                                    >
                                      Download
                                    </Button>
                                  )}
                                </div>
                                <div className="flex gap-2 m-2">
                                  <span className="col-span-1">
                                    Environment
                                  </span>
                                  <Form.Item
                                    className="col-span-1"
                                    name={[field.name, "postman_environment"]}
                                  >
                                    <Upload
                                      {...propsE}
                                      className="flex gap-4"
                                      defaultFileList={[
                                        {
                                          uid: index,
                                          name: environments[index]?.postman
                                            ?.environment?.name
                                            ? environments[index]?.postman
                                                ?.environment?.name
                                            : undefined,
                                          status: "done",
                                        },
                                      ]}
                                      fileList={[
                                        {
                                          uid: index,
                                          name: environments[index]?.postman
                                            ?.environment?.name
                                            ? environments[index]?.postman
                                                ?.environment?.name
                                            : "",
                                          status: "done",
                                        },
                                      ]}
                                      beforeUpload={(file) => {
                                        return new Promise((resolve) => {
                                          const reader = new FileReader();
                                          reader.readAsDataURL(file);
                                          reader.onload = (e) => {
                                            try {
                                              store.dispatch(
                                                setEnvironments([
                                                  ...environments?.map(
                                                    (env, i) => {
                                                      if (i === index) {
                                                        return {
                                                          ...environments[
                                                            index
                                                          ],
                                                          postman: {
                                                            ...environments[
                                                              index
                                                            ]?.postman,
                                                            environment: {
                                                              name: file.name,
                                                              content:
                                                                e.target.result.split(
                                                                  ","
                                                                )[1],
                                                            },
                                                          },
                                                        };
                                                      }
                                                      return env;
                                                    }
                                                  ),
                                                ])
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Lỗi khi đọc file JSON:",
                                                error
                                              );
                                            }
                                          };
                                        });
                                      }}
                                    >
                                      <Button>
                                        <Icon type="upload" /> Upload
                                      </Button>
                                    </Upload>
                                  </Form.Item>
                                  {environments[index]?.postman?.environment
                                    ?.content && (
                                    <Button
                                      onClick={(e) => {
                                        exportData(
                                          environments[index]?.postman
                                            ?.environment?.content,
                                          environments[index]?.postman
                                            ?.environment?.name
                                        );
                                      }}
                                    >
                                      Download
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      {/* -------------------------------- */}
                      <div className="flex items-center" ref={refCaseSecond10}>
                        <Button
                          type="dashed"
                          onClick={() => handleAddEnvironment(add)}
                          block
                        >
                          Add Environment
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </Form.List>
            </Form>
          </div>
          {/* -------------------------------- */}
          <div className="mt-20 flex gap-3" >
            <Button
            ref={refCaseSecond11}
              htmlType="submit"
              className="text-green-400 pointer-events-auto border border-solid border-green-400  "
              disabled={false}
              onClick={() => {
                form.submit();
              }}
            >
              {service_id ? "Update" : "Save"}
            </Button>
            <Button
              className="text-gray-400 pointer-events-auto border border-solid border-gray-400  "
              ref={refCaseSecond12}
              onClick={async () => {
                localStorage.setItem("build", true);
                const fetchC = async () => {
                  let res = await apiCaller({
                    request: vmsApi.createService({
                      ...service,
                      environments: environments,
                    }),
                  });
                  setServiceId(res.id);
                  if (environments.length === 1) {
                    navigate(
                      `/ocean?service=${res.id}&env=${environments[0].name}`
                    );
                  } else {
                    setIsModalOpenEnv(true);
                  }
                };

                const fetchU = async (service_id) => {
                  let res = await apiCaller({
                    request: vmsApi.updateService(
                      {
                        ...service,
                        environments: environments.map((env) => {
                          return {
                            ...env,
                            vm: env.vm.id,
                          };
                        }),
                        environment: undefined,
                      },
                      service_id
                    ),
                  });
                  setServiceId(res.id);
                  if (environments.length === 1) {
                    navigate(
                      `/ocean?service=${res.id}&env=${environments[0].name}`
                    );
                  } else {
                    setIsModalOpenEnv(true);
                  }
                };

                if (service_id) {
                  fetchU(service_id);
                } else {
                  fetchC();
                }
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
                  return (
                    <Radio key={idx} value={val?.name}>
                      {val?.name}
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
