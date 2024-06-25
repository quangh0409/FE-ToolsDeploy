import { Button, Card, Form, Input, Modal, Select, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import useEffectOnce from "../../hook/useEffectOnce";
import githubApi from "../../apis/github.api";
import TemplateDetailPage from "../../components/Scan";
import { useDispatch, useSelector } from "react-redux";
import vmsApi from "../../apis/vms.api";
import { store } from "../../redux/store";
import {
  addService,
  setDeploy,
  setDockerConfig,
  setEnvironments,
} from "../../redux/reducer/user";
import scanApi from "../../apis/scan.api";
import apiCaller from "../../apis/apiCaller";
import { message } from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";

export default function Configuration(props) {
  let deploy = useSelector((state) => state.user.deploy);
  if (deploy?.loading) {
    deploy = JSON.parse(localStorage.getItem("deploy"));
    store.dispatch(setDeploy(deploy));
  }
  const [errorLine, setErrorLine] = useState();
  const [resultScanSyntax, setResultScanSyntax] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [vms, setVms] = useState([]);
  const [vmsT, setVmsT] = useState([]);
  const [contentfile, setContentfile] = useState();
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const service_t = useSelector((state) => state.user.service);
  const [fields, setFields] = useState();
  const navigate = useNavigate();

  const dockerConfig = useSelector((state) => state.user.dockerConfig);

  useEffect(() => {
    const items = [];
    items.push(
      {
        name: ["items", 0, "name_env"],
        value: deploy.environment.name,
      },
      {
        name: ["items", 0, "vm_instance"],
        value: deploy.environment.vm.host,
      },
      {
        name: ["items", 0, "branch"],
        value: deploy.environment.branch,
      },
      {
        name: ["items", 0, "dockerfile"],
        value: deploy.environment.docker_file.map((file) => file.name),
      },
      {
        name: ["items", 0, "docker_compose"],
        value: deploy.environment.docker_compose.map((file) => file.name),
      }
    );
    setFields([
      {
        name: ["name_service"],
        value: deploy.service_name,
      },
      {
        name: ["Architectura"],
        value: deploy.architecture,
      },
      {
        name: ["language"],
        value: deploy.language,
      },
      ...items,
    ]);
  }, [deploy]);

  const fetch = async (architecture, language) => {
    const docker = await apiCaller({
      request: githubApi.GetPathFileDockerByAccessToken(
        deploy.repo,
        deploy.branch
      ),
    });
    const tempalteDockerfile = await apiCaller({
      request: vmsApi.findTemplate(language, architecture, "Dockerfile"),
    });

    const tempalteDockeCompose = await apiCaller({
      request: vmsApi.findTemplate(language, architecture, "docker-compose"),
    });

    if (tempalteDockeCompose?.code && tempalteDockerfile?.code) {
      store.dispatch(
        setDockerConfig({
          docker_file: [...dockerConfig.docker_file, ...docker.dockerfile],
          docker_compose: [
            ...docker.docker_compose,
            ...dockerConfig.docker_compose,
          ],
        })
      );
    } else if (!tempalteDockeCompose?.code && !tempalteDockerfile?.code) {
      store.dispatch(
        setDockerConfig({
          docker_file: [
            ...dockerConfig.docker_file,
            ...docker.dockerfile,
            ...tempalteDockerfile.map((file) => {
              return {
                path: file.name,
                name: "Template",
                content: file.content,
              };
            }),
          ],
          docker_compose: [
            ...dockerConfig.docker_compose,
            ...docker.docker_compose,
            ...tempalteDockeCompose.map((file) => {
              return {
                path: file.name,
                name: "Template",
                content: file.content,
              };
            }),
          ],
        })
      );
    } else if (!tempalteDockeCompose?.code && tempalteDockerfile?.code) {
      store.dispatch(
        setDockerConfig({
          docker_file: [...dockerConfig.docker_file, ...docker.dockerfile],
          docker_compose: [
            ...dockerConfig.docker_compose,
            ...docker.docker_compose,
            ...tempalteDockeCompose.map((file) => {
              return {
                path: file.name,
                name: "Template",
                content: file.content,
              };
            }),
          ],
        })
      );
    } else if (tempalteDockeCompose?.code && !tempalteDockerfile?.code) {
      store.dispatch(
        setDockerConfig({
          docker_file: [
            ...dockerConfig.docker_file,
            ...docker.dockerfile,
            ...tempalteDockerfile.map((file) => {
              return {
                path: file.name,
                name: "Template",
                content: file.content,
              };
            }),
          ],
          docker_compose: [
            ...dockerConfig.docker_compose,
            ...docker.docker_compose,
          ],
        })
      );
    }
  };

  useEffectOnce(() => {
    fetch(deploy.architecture, deploy.language);
  });

  const exportData = (content, filename) => {
    const jsonString = `data:application/json;chatset=utf-8,${atob(content)}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}`;

    link.click();
  };

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
  };

  return (
    <div className="max-h-max w-screen">
      <div className="ml-10 w-11/12 f-full">
        <Form
          form={form}
          fields={fields}
          onFinish={() => {
            if (localStorage.getItem("build") === "true") {
              const fetchC = async () => {
                let res = await apiCaller({
                  request: vmsApi.createService({
                    name: deploy.service_name,
                    architectura: deploy.architecture,
                    language: deploy.language,
                    repo: deploy.repo,
                    source: deploy.source,
                    environments: [
                      {
                        ...deploy.environment,
                        vm: deploy.environment.vm.id,
                        docker_file: deploy.environment.docker_file.map((f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }),
                        docker_compose: deploy.environment.docker_compose.map(
                          (f) => {
                            return {
                              ...f,
                              location: f?.path ? f?.path : f?.location,
                              path: undefined,
                            };
                          }
                        ),
                      },
                    ],
                  }),
                });
                if (!res?.code) {
                  navigate(
                    `/ocean?service=${res.id}&env=${deploy.environment.name}`
                  );
                } else {
                  message.error("actions failed");
                }
              };

              const fetchUE = async () => {
                let res = await apiCaller({
                  request: vmsApi.updateEnvService(
                    {
                      ...deploy.environment,
                      vm: deploy.environment.vm.id,
                      docker_file: deploy.environment.docker_file.map((f) => {
                        return {
                          ...f,
                          location: f?.path ? f?.path : f?.location,
                          path: undefined,
                        };
                      }),
                      docker_compose: deploy.environment.docker_compose.map(
                        (f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }
                      ),
                    },
                    deploy.service_id
                  ),
                });
                if (!res?.code) {
                  navigate(
                    `/ocean?service=${deploy.service_id}&env=${deploy.environment.name}`
                  );
                } else {
                  message.error("update env failed");
                }
              };
              const fetchCE = async () => {
                let res = await apiCaller({
                  request: vmsApi.addEnvService(
                    {
                      ...deploy.environment,
                      vm: deploy.environment.vm.id,
                      docker_file: deploy.environment.docker_file.map((f) => {
                        return {
                          ...f,
                          location: f?.path ? f?.path : f?.location,
                          path: undefined,
                        };
                      }),
                      docker_compose: deploy.environment.docker_compose.map(
                        (f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }
                      ),
                    },
                    deploy.service_id
                  ),
                });
                if (!res?.code) {
                  navigate(
                    `/ocean?service=${deploy.service_id}&env=${deploy.environment.name}`
                  );
                } else {
                  message.error("update env faile");
                }
              };

              // if (deploy.service_id) {
              if (deploy.type === "UPDATEENV") {
                fetchUE();
              } else if (deploy.type === "CREATEENV") {
                fetchCE();
              } else {
                fetchC();
              }
            } else {
              const fetchC = async () => {
                let res = await apiCaller({
                  request: vmsApi.createService({
                    name: deploy.service_name,
                    architectura: deploy.architecture,
                    language: deploy.language,
                    repo: deploy.repo,
                    source: deploy.source,
                    environments: [
                      {
                        ...deploy.environment,
                        vm: deploy.environment.vm.id,
                        docker_file: deploy.environment.docker_file.map((f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }),
                        docker_compose: deploy.environment.docker_compose.map(
                          (f) => {
                            return {
                              ...f,
                              location: f?.path ? f?.path : f?.location,
                              path: undefined,
                            };
                          }
                        ),
                      },
                    ],
                  }),
                });
                if (res?.code) {
                  message.error("actions failed");
                }
              };

              const fetchUE = async () => {
                let res = await apiCaller({
                  request: vmsApi.updateEnvService(
                    {
                      ...deploy.environment,
                      vm: deploy.environment.vm.id,
                      docker_file: deploy.environment.docker_file.map((f) => {
                        return {
                          ...f,
                          location: f?.path ? f?.path : f?.location,
                          path: undefined,
                        };
                      }),
                      docker_compose: deploy.environment.docker_compose.map(
                        (f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }
                      ),
                    },
                    deploy.service_id
                  ),
                });
                if (res?.code) {
                  message.error("update env failed");
                }
              };
              const fetchCE = async () => {
                let res = await apiCaller({
                  request: vmsApi.addEnvService(
                    {
                      ...deploy.environment,
                      vm: deploy.environment.vm.id,
                      docker_file: deploy.environment.docker_file.map((f) => {
                        return {
                          ...f,
                          location: f?.path ? f?.path : f?.location,
                          path: undefined,
                        };
                      }),
                      docker_compose: deploy.environment.docker_compose.map(
                        (f) => {
                          return {
                            ...f,
                            location: f?.path ? f?.path : f?.location,
                            path: undefined,
                          };
                        }
                      ),
                    },
                    deploy.service_id
                  ),
                });
                if (res?.code) {
                  message.error("update env faile");
                }
              };

              // if (deploy.service_id) {
              if (deploy.type === "UPDATEENV") {
                fetchUE();
              } else if (deploy.type === "CREATEENV") {
                fetchCE();
              } else {
                fetchC();
              }
            }
          }}
          initialValues={{
            items: [{}],
          }}
        >
          <div className="flex flex-row w-full h-12  justify-between mb-5">
            <div className="h-full">
              <h2>Webapp</h2>
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
                  disabled={deploy.type === "UPDATEENV" ? true : false}
                  // value={}
                  onChange={(e) => {
                    // store.dispatch(addService({ name: e.target.value }));
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-row w-full h-12  justify-between mb-5">
            <div className="h-full">
              <h2>Architecture</h2>
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
                  disabled={deploy.type === "UPDATEENV" ? true : false}
                  className="w-full h-full rounded-lg "
                  onChange={(value) => {
                    store.dispatch(
                      setDeploy({
                        ...deploy,
                        architecture: value,
                      })
                    );
                    fetch(value, deploy.language);
                    localStorage.setItem(
                      "deploy",
                      JSON.stringify({
                        ...deploy,
                        architecture: value,
                      })
                    );
                  }}
                  options={itemsArchitectura}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-row w-full h-12  justify-between mb-5">
            <div className="h-full">
              <h2>Language</h2>
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
                  disabled={true}
                  className="w-full h-full rounded-lg "
                  onChange={(value) => {}}
                  options={[]}
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
                        title={
                          "Environment: " +
                          `${
                            deploy?.environment?.name
                              ? deploy?.environment?.name
                              : ""
                          }`
                        }
                        key={field.key}
                        extra={
                          <CloseOutlined
                          // onClick={() => handleRemoveCard(remove, index)}
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
                                  message:
                                    "Please input your name environment!",
                                },
                              ]}
                              name={[field.name, "name_env"]}
                            >
                              <Input
                                value={deploy.environment.name}
                                disabled={
                                  deploy.type === "UPDATEENV" ? true : false
                                }
                                onChange={(e) => {
                                  store.dispatch(
                                    setDeploy({
                                      ...deploy,
                                      env_name: e.target.value,
                                      environment: {
                                        ...deploy.environment,
                                        name: e.target.value,
                                      },
                                    })
                                  );
                                  localStorage.setItem(
                                    "deploy",
                                    JSON.stringify({
                                      ...deploy,
                                      env_name: e.target.value,
                                      environment: {
                                        ...deploy.environment,
                                        name: e.target.value,
                                      },
                                    })
                                  );
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
                                disabled={true}
                                onChange={(v, op) => {}}
                                options={
                                  deploy.type === "UPDATE" &&
                                  !!deploy?.service_id
                                    ? []
                                    : itemsVM
                                }
                              />
                            </Form.Item>
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Branch</h2>
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
                                disabled={true}
                                className="w-full h-full rounded-lg "
                                options={[]}
                              />
                            </Form.Item>
                          </div>
                        </div>
                        {/* -------------------------------- */}
                        <div className="flex flex-row w-full h-12  justify-between mb-5">
                          <div className="h-full">
                            <h2>Dockerfile</h2>
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
                                  const check = ops.filter((op) => {
                                    if (
                                      /^([a-zA-Z0-9_-]+\/)*Dockerfile(\.[a-zA-Z0-9]+)?$/.test(
                                        op.label
                                      )
                                    ) {
                                      return false;
                                    } else {
                                      return true;
                                    }
                                  });
                                  if (check.length > 0) {
                                    let mess = "";
                                    check.map((c) => {
                                      mess += c.label;
                                    });
                                    message.error(
                                      `File (${mess})naming error and relative path error leading to the file`
                                    );
                                  } else {
                                    store.dispatch(
                                      setDeploy({
                                        ...deploy,
                                        environment: {
                                          ...deploy.environment,
                                          docker_file: ops.map((op) => {
                                            const name = op.label.split("/");
                                            return {
                                              location: op.label,
                                              name: name[name.length - 1],
                                              content: op.content,
                                            };
                                          }),
                                        },
                                      })
                                    );
                                    localStorage.setItem(
                                      "deploy",
                                      JSON.stringify({
                                        ...deploy,
                                        environment: {
                                          ...deploy.environment,
                                          docker_file: ops.map((op) => {
                                            const name = op.label.split("/");
                                            return {
                                              location: op.label,
                                              name: name[name.length - 1],
                                              content: op.content,
                                            };
                                          }),
                                        },
                                      })
                                    );
                                  }
                                }}
                                options={dockerConfig?.docker_file.map(
                                  (d, i) => {
                                    return {
                                      key: i,
                                      label: d?.path ? d?.path : d?.location,
                                      value: d?.path ? d?.path : d?.location,
                                      desc: d?.path
                                        ? `${d.name} (${d?.path})`
                                        : `${d.name} (${d?.location})`,
                                      content: d.content,
                                      disabled:
                                        !/^([a-zA-Z0-9_-]+\/)*Dockerfile(\.[a-zA-Z0-9]+)?$/.test(
                                          d?.path ? d?.path : d?.location
                                        ),
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
                                            name: option.data.label,
                                            oldname: option.data.label,
                                            content: option.data.content,
                                            type: "DOCKERFILE",
                                          });
                                          e.stopPropagation();
                                        }}
                                      >
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
                                            oldname: "",
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
                                          const check =
                                            dockerConfig?.docker_file?.findIndex(
                                              (f, idx) => {
                                                if (
                                                  (contentfile.oldname ===
                                                    contentfile.name &&
                                                    contentfile.name ===
                                                      f.path) ||
                                                  (contentfile.oldname !==
                                                    contentfile.name &&
                                                    contentfile.oldname ===
                                                      f.path &&
                                                    !contentfile.oldname.includes(
                                                      "Template"
                                                    ))
                                                ) {
                                                  store.dispatch(
                                                    setDockerConfig({
                                                      docker_compose:
                                                        dockerConfig.docker_compose,
                                                      docker_file:
                                                        dockerConfig.docker_file.map(
                                                          (f, i) => {
                                                            const t =
                                                              contentfile.name.split(
                                                                "/"
                                                              );
                                                            if (
                                                              f.path ===
                                                              contentfile.name
                                                            ) {
                                                              return {
                                                                name: t[
                                                                  t.length - 1
                                                                ],
                                                                path: contentfile.name,
                                                                content:
                                                                  contentfile.content,
                                                              };
                                                            }
                                                            return f;
                                                          }
                                                        ),
                                                    })
                                                  );
                                                  return true;
                                                }
                                                return false;
                                              }
                                            );

                                          if (check !== 0) {
                                            const t =
                                              contentfile.name.split("/");
                                            store.dispatch(
                                              setDockerConfig({
                                                docker_compose:
                                                  dockerConfig.docker_compose,
                                                docker_file: [
                                                  ...dockerConfig.docker_file,
                                                  {
                                                    name: t[t.length - 1],
                                                    path: contentfile.name,
                                                    content:
                                                      contentfile.content,
                                                  },
                                                ],
                                              })
                                            );
                                          }

                                          store.dispatch(
                                            setDeploy({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                docker_file:
                                                  deploy.environment.docker_file.map(
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
                                                  ),
                                              },
                                            })
                                          );
                                          localStorage.setItem(
                                            "deploy",
                                            JSON.stringify({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                docker_file:
                                                  deploy.environment.docker_file.map(
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
                                                  ),
                                              },
                                            })
                                          );
                                          // @TODO fix edit file docker-compose thay bawngf redux
                                        } else {
                                          const check =
                                            dockerConfig.docker_compose?.findIndex(
                                              (f, idx) => {
                                                if (
                                                  (contentfile.oldname ===
                                                    contentfile.name &&
                                                    contentfile.name ===
                                                      f.path) ||
                                                  (contentfile.oldname !==
                                                    contentfile.name &&
                                                    contentfile.oldname ===
                                                      f.path &&
                                                    !contentfile.oldname.includes(
                                                      "Template"
                                                    ))
                                                ) {
                                                  store.dispatch(
                                                    setDockerConfig({
                                                      docker_file:
                                                        dockerConfig.docker_file,
                                                      docker_compose:
                                                        dockerConfig.docker_compose.map(
                                                          (f, i) => {
                                                            const t =
                                                              contentfile.name.split(
                                                                "/"
                                                              );
                                                            if (
                                                              f.path ===
                                                              contentfile.name
                                                            ) {
                                                              return {
                                                                name: t[
                                                                  t.length - 1
                                                                ],
                                                                path: contentfile.name,
                                                                content:
                                                                  contentfile.content,
                                                              };
                                                            }
                                                            return f;
                                                          }
                                                        ),
                                                    })
                                                  );
                                                  return true;
                                                }
                                                return false;
                                              }
                                            );

                                          if (check !== 0) {
                                            const t =
                                              contentfile.name.split("/");
                                            store.dispatch(
                                              setDockerConfig({
                                                docker_file:
                                                  dockerConfig.docker_file,
                                                docker_compose: [
                                                  ...dockerConfig.docker_compose,
                                                  {
                                                    name: t[t.length - 1],
                                                    path: contentfile.name,
                                                    content:
                                                      contentfile.content,
                                                  },
                                                ],
                                              })
                                            );
                                          }

                                          store.dispatch(
                                            setDeploy({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                docker_compose:
                                                  deploy.environment.docker_compose.map(
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
                                                  ),
                                              },
                                            })
                                          );
                                          localStorage.setItem(
                                            "deploy",
                                            JSON.stringify({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                docker_compose:
                                                  deploy.environment.docker_compose.map(
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
                                                  ),
                                              },
                                            })
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
                                      oldname: "",
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
                            <h2>Docker-compose</h2>
                          </div>
                          <div className="w-8/12 h-full ">
                            <Form.Item
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your Docker-compose!",
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
                                  const check = ops.filter((op) => {
                                    if (
                                      /^([a-zA-Z0-9_-]+\/)*docker-compose(\.[a-zA-Z0-9]+)?\.(yml|yaml)$/.test(
                                        op.label
                                      )
                                    ) {
                                      return false;
                                    } else {
                                      return true;
                                    }
                                  });
                                  if (check.length > 0) {
                                    let mess = "";
                                    check.map((c) => {
                                      mess += c.label;
                                    });
                                    message.error(
                                      `File (${mess})naming error and relative path error leading to the file`
                                    );
                                  } else {
                                    store.dispatch(
                                      setDeploy({
                                        ...deploy,
                                        environment: {
                                          ...deploy.environment,
                                          docker_compose: ops.map((op) => {
                                            const name = op.label.split("/");
                                            return {
                                              location: op.label,
                                              name: name[name.length - 1],
                                              content: op.content,
                                            };
                                          }),
                                        },
                                      })
                                    );
                                    localStorage.setItem(
                                      "deploy",
                                      JSON.stringify({
                                        ...deploy,
                                        environment: {
                                          ...deploy.environment,
                                          docker_compose: ops.map((op) => {
                                            const name = op.label.split("/");
                                            return {
                                              location: op.label,
                                              name: name[name.length - 1],
                                              content: op.content,
                                            };
                                          }),
                                        },
                                      })
                                    );
                                  }
                                }}
                                options={dockerConfig?.docker_compose.map(
                                  (d) => {
                                    return {
                                      label: d?.path ? d?.path : d?.location,
                                      value: d?.path ? d?.path : d?.location,
                                      desc: d?.path
                                        ? `${d.name} (${d?.path})`
                                        : `${d.name} (${d?.location})`,
                                      content: d.content,
                                      disabled:
                                        !/^([a-zA-Z0-9_-]+\/)*docker-compose(\.[a-zA-Z0-9]+)?\.(yml|yaml)$/.test(
                                          d?.path ? d?.path : d?.location
                                        ),
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
                                            name: option.data.label,
                                            oldname: option.data.label,
                                            content: option.data.content,
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
                                            oldname: "",
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
                            <h2>Postman</h2>
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
                                      name: deploy.environment?.postman
                                        ?.collection?.name
                                        ? deploy.environment?.postman
                                            ?.collection?.name
                                        : "",
                                      status: "done",

                                      percent: 33,
                                    },
                                  ]}
                                  fileList={[
                                    {
                                      uid: index,
                                      name: deploy.environment?.postman
                                        ?.collection?.name
                                        ? deploy.environment?.postman
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
                                            setDeploy({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                postman: {
                                                  ...deploy.environment.postman,
                                                  collection: {
                                                    name: file.name,
                                                    content:
                                                      e.target.result.split(
                                                        ","
                                                      )[1],
                                                  },
                                                },
                                              },
                                            })
                                          );
                                          localStorage.setItem(
                                            "deploy",
                                            JSON.stringify({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                postman: {
                                                  ...deploy.environment.postman,
                                                  collection: {
                                                    name: file.name,
                                                    content:
                                                      e.target.result.split(
                                                        ","
                                                      )[1],
                                                  },
                                                },
                                              },
                                            })
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
                              {deploy.environment?.postman?.collection
                                ?.content && (
                                <Button
                                  onClick={(e) => {
                                    exportData(
                                      deploy.environment?.postman?.collection
                                        ?.content,
                                      deploy.environment?.postman?.collection
                                        ?.name
                                    );
                                  }}
                                >
                                  Download
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-2 m-2">
                              <span className="col-span-1">Environment</span>
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
                                      name: deploy.environment?.postman
                                        ?.environment?.name
                                        ? deploy.environment?.postman
                                            ?.environment?.name
                                        : undefined,
                                      status: "done",
                                    },
                                  ]}
                                  fileList={[
                                    {
                                      uid: index,
                                      name: deploy.environment?.postman
                                        ?.environment?.name
                                        ? deploy.environment?.postman
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
                                            setDeploy({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                postman: {
                                                  ...deploy.environment.postman,
                                                  environment: {
                                                    name: file.name,
                                                    content:
                                                      e.target.result.split(
                                                        ","
                                                      )[1],
                                                  },
                                                },
                                              },
                                            })
                                          );
                                          localStorage.setItem(
                                            "deploy",
                                            JSON.stringify({
                                              ...deploy,
                                              environment: {
                                                ...deploy.environment,
                                                postman: {
                                                  ...deploy.environment.postman,
                                                  environment: {
                                                    name: file.name,
                                                    content:
                                                      e.target.result.split(
                                                        ","
                                                      )[1],
                                                  },
                                                },
                                              },
                                            })
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
                              {deploy.environment?.postman?.environment
                                ?.content && (
                                <Button
                                  onClick={(e) => {
                                    exportData(
                                      deploy.environment?.postman?.environment
                                        ?.content,
                                      deploy.environment?.postman?.environment
                                        ?.name
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
                </div>
              );
            }}
          </Form.List>
        </Form>
      </div>
      {/* -------------------------------- */}
      <div className="mt-20 flex gap-3 text-center justify-center">
        <div className="flex justify-between w-[200px]">
          <Button
            htmlType="submit"
            className="text-green-400 pointer-events-auto border border-solid border-green-400  "
            disabled={false}
            onClick={() => {
              form.submit();
            }}
          >
            {deploy?.service_id ? "Update" : "Save"}
          </Button>
          <Button
            className="text-gray-400 pointer-events-auto border border-solid border-gray-400  "
            onClick={async () => {
              form.submit();
              localStorage.setItem("build", true);
            }}
          >
            Build
          </Button>
        </div>
      </div>
    </div>
  );
}
