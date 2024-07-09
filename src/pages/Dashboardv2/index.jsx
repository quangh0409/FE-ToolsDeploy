import {
  CaretLeftOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, Table, Space, message } from "antd";
import { useEffect, useState } from "react";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import useEffectOnce from "../../hook/useEffectOnce";
import { store } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  addVm,
  setClearData,
  setClearDeploy,
  setClearDockerConfig,
  setData,
  setDeploy,
  setDockerConfig,
} from "../../redux/reducer/user";
import { useNavigate } from "react-router-dom";
export default function Dashboardv2() {
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  const dataSource = useSelector((state) => state.user.data);
  console.log("🚀 ~ dataSource:", dataSource);
  const deploy = useSelector((state) => state.user.deploy);

  function timeDifference(time1, time2) {
    let date1 = new Date(time1).getTime();
    let date2 = new Date(time2).getTime();

    let diffInMs = Math.abs(date2 - date1);
    let diffInSecs = Math.floor(diffInMs / 1000);
    let mins = Math.floor(diffInSecs / 60);
    let secs = diffInSecs % 60;
    let hours = Math.floor(mins / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${mins}m ${secs}s`;
    }
  }

  function subtractTime(time1, time2) {
    // Chuyển đổi thời gian thành mili giây
    let t1 = new Date(time1).getTime();
    let t2 = new Date(time2).getTime();

    // Tính toán sự khác biệt
    let diff = Math.abs(t1 - t2);

    // Chuyển đổi sự khác biệt thành phút và giây
    let minutes = Math.floor(diff / 60000);
    let seconds = ((diff % 60000) / 1000).toFixed(0);

    // Trả về kết quả dưới dạng chuỗi
    return minutes + "m " + seconds + "s";
  }

  const fetch = async () => {
    const res = await apiCaller({
      request: vmsApi.getInfosRepo(search),
    });
    if (res?.code) {
      message.error(res.errors[0].message | "BE sysytem error");
      fetch();
    } else {
      store.dispatch(setClearData());
      let i = 0;
      for (const repo of res) {
        let check = "";
        if (repo?.last?.vm?.id) {
          const res = await apiCaller({
            request: vmsApi.checkConnect(repo?.last?.vm?.id),
          });
          if (!res?.code) {
            check = res.status;
          }
        }

        const branchs = [];
        for (const branch of repo.branchs) {
          if (branch?.vm) {
            const res = await apiCaller({
              request: vmsApi.checkConnect(branch?.last_record?.vm?.id),
            });
            if (!res?.code) {
              branchs.push({
                ...branch,
                check: res.status,
              });
            } else {
              branchs.push({
                ...branch,
                check: "DISCONNECTED",
              });
            }
          } else {
            branchs.push({
              ...branch,
            });
          }
        }

        store.dispatch(
          setData({
            key: i.toString(),
            ...repo,
            repository: repo.name,
            language: repo.language,
            branch: repo?.last?.branch,
            commit: repo?.last?.commit_id?.substring(0, 6),
            index: repo?.last?.index,
            vm_host: repo?.last?.vm?.host,
            check: check,
            branchs: branchs,
          })
        );
        i++;
      }
    }
  };

  useEffectOnce(() => {
    store.dispatch(setClearDeploy());
    store.dispatch(setClearDockerConfig());
    localStorage.removeItem("deploy");
    fetch();
    setReload(true);
  }, [reload]);

  const columns = [
    {
      title: "REPOSITORY",
      key: "repository",
      render: (record) => <a href={record?.html_url}>{record?.repository}</a>,
    },
    {
      title: "LANGUAGE",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "LAST DEPLOYED BRANCH ",
      key: "branch",
      render: (record) => {
        if (record?.branch)
          return (
            <a href={`${record?.html_url}/tree/${record?.branch}`}>
              {record?.branch}
            </a>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "LAST DEPLOYED COMMIT",
      key: "commit",
      render: (record) => {
        if (record?.last)
          return (
            <>
              <a
                href={record?.last?.commit_html_url}
                className="cursor-pointer hover:text-blue-500"
              >
                <div>{record?.commit?.substring(0, 6)}</div>
                <div>{record?.last?.commit_message}</div>
              </a>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "LAST PIPELINE CI/CD",
      key: "index",
      render: (record) => {
        if (record?.last)
          return (
            <>
              <div
                className="flex gap-2 cursor-pointer hover:text-blue-500"
                onClick={() => {
                  navigate(
                    `/ocean?service=${record?.service_id}&env=${record?.last?.env_name}&name=${record?.last?.service_name}&record=${record?.last?.id}`
                  );
                }}
              >
                <div>
                  {record?.last?.status === "SUCCESSFULLY" ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                  )}
                </div>
                <div>{`#${record.index} (${timeDifference(
                  record?.last?.created_time,
                  new Date()
                )} ago)`}</div>
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "DURATION",
      key: "duration",
      render: (record) => {
        if (record?.last)
          return (
            <div className="flex gap-1">
              <div>
                <ClockCircleOutlined style={{ color: "blue" }} />
              </div>
              <div>
                {subtractTime(
                  record?.last?.created_time,
                  record?.last?.end_time
                )}
              </div>
            </div>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "VM-INSTANCE",
      key: "vm_host",
      render: (record) => {
        if (record?.vm_host)
          return (
            <>
              <div
                className="flex gap-2 cursor-pointer hover:text-blue-500"
                onClick={() => {
                  store.dispatch(addVm(record?.last.vm?.id));
                  navigate(`/vm-instance?vm=${record?.last.vm?.id}`);
                }}
              >
                <div>
                  {record?.check === "CONNECTED" ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CheckCircleTwoTone twoToneColor="#EE9494" />
                  )}
                </div>
                <div>{record.vm_host}</div>
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "ACTIONS",
      key: "action",
      render: (record) => {
        return (
          <>
            <div
              className="flex gap-1 cursor-pointer hover:text-blue-500"
              onClick={async () => {
                const res = await apiCaller({
                  request: vmsApi.deleteServiceInAllVm(record.service_id),
                });
                if (res?.code) {
                  message.error(res?.errors[0].message);
                } else {
                  message.info("DELETE SUCCESSFULLY");
                  fetch();
                }
              }}
            >
              <div>
                <DeleteOutlined />
              </div>
              <div>Delete</div>
            </div>
          </>
        );
      },
    },
  ];

  const expandedRowRender = (ParentRecord) => {
    const subColumns = [
      {
        title: "BRANCH",
        key: "branch",
        render: (record) => (
          <a href={`${ParentRecord?.html_url}/tree/${record?.branch}`}>
            {record?.branch}
          </a>
        ),
      },
      {
        title: "ENVIRONMENT",
        key: "name",
        render: (record) => {
          if (record?.last_record) return <div>{record?.name}</div>;
          else return <div>N/A</div>;
        },
      },
      {
        title: "VM-INSTANCE",
        key: "vm",
        render: (record) => {
          if (record?.vm)
            return (
              <>
                <div
                  className="flex gap-2 cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    store.dispatch(addVm(record?.vm?.id));
                    navigate(`/vm-instance?vm=${record?.vm?.id}`);
                  }}
                >
                  <div>
                    {record?.check === "CONNECTED" ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <CheckCircleTwoTone twoToneColor="#EE9494" />
                    )}
                  </div>
                  <div>{record?.vm?.host}</div>
                </div>
              </>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "TOTAL SUCCESS",
        dataIndex: "record_success",
        key: "record_success",
        render: (text) => {
          if (text)
            return (
              <>
                <Badge status="success" text={`${text}`} />
              </>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "TOTAL FAILE",
        dataIndex: "record_error",
        key: "record_error",
        render: (text) => {
          if (text !== undefined)
            return (
              <>
                <Badge status="error" text={`${text}`} />
              </>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "LAST PIPELINE CI/CD",
        key: "last_pipeline",
        render: (record) => {
          if (record?.last_record)
            return (
              <>
                <div
                  className="flex gap-2 cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigate(
                      `/ocean?service=${ParentRecord?.service_id}&env=${record?.name}&name=${ParentRecord?.name}&record=${record?.last_record?.id}`
                    );
                  }}
                >
                  <div>
                    {record?.last_record?.status === "SUCCESSFULLY" ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    )}
                  </div>
                  <div>{`#${record?.last_record?.index} (${timeDifference(
                    record?.last_record?.created_time,
                    new Date()
                  )} ago)`}</div>
                </div>
              </>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "DURATION",
        key: "duration",
        render: (record) => {
          if (record?.last_record)
            return (
              <div className="flex gap-1">
                <div>
                  <ClockCircleOutlined style={{ color: "blue" }} />
                </div>
                <div>
                  {subtractTime(
                    record?.last_record?.created_time,
                    record?.last_record?.end_time
                  )}
                </div>
              </div>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "LAST DEPLOYED COMMIT",
        key: "commit",
        render: (record) => {
          if (record?.last_record) {
            return (
              <>
                <div
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {}}
                >
                  <a href={record?.last_record?.commit_html_url}>
                    #{record?.last_record?.commit_id?.substring(0, 6)}
                  </a>
                  <div>{record?.last_record?.commit_message}</div>
                </div>
              </>
            );
          } else {
            return (
              <>
                <div
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {}}
                >
                  <a href={record?.last_commit?.url}>
                    #{record?.last_commit?.commit_id?.substring(0, 6)}
                  </a>
                  <div>{record?.last_commit?.commit_message}</div>
                </div>
              </>
            );
          }
        },
      },
      {
        title: "ACTIONS",
        key: "actions",
        render: (record) => (
          <Space size="middle">
            {record?.vm ? (
              <>
                <div
                  className="flex cursor-pointer  hover:text-blue-500"
                  onClick={() => {
                    localStorage.setItem("build", true);
                    navigate(
                      `/ocean?service=${ParentRecord?.service_id}&env=${record?.name}`
                    );
                  }}
                >
                  <div>
                    <CaretLeftOutlined />
                  </div>
                  <div>Re-build</div>
                </div>
                <div
                  className="flex cursor-pointer  hover:text-blue-500"
                  onClick={() => {
                    navigate(
                      `/vm-instance/detail?id=${ParentRecord?.service_id}&env=${record?.name}`
                    );
                  }}
                >
                  <div>
                    <EyeOutlined />
                  </div>
                  <div>Detail</div>
                </div>
                <div
                  className="flex gap-1 cursor-pointer  hover:text-blue-500"
                  onClick={async () => {
                    let environment = {};
                    if (ParentRecord?.service_id && record?.name) {
                      const res = await apiCaller({
                        request: vmsApi.getServiceById(
                          ParentRecord?.service_id
                        ),
                      });
                      if (!res?.code) {
                        environment = res.environment.find(
                          (env) => env.name === record?.name
                        );
                      }
                    }
                    console.log("🚀 ~ onClick={ ~ environment:", environment);
                    store.dispatch(
                      setDockerConfig({
                        docker_compose: environment.docker_compose.map(
                          (file) => {
                            return {
                              ...file,
                              path: file.location,
                              location: undefined,
                            };
                          }
                        ),
                        docker_file: environment.docker_file.map((file) => {
                          return {
                            ...file,
                            path: file.location,
                            location: undefined,
                          };
                        }),
                      })
                    );
                    store.dispatch(
                      setDeploy({
                        ...deploy,
                        type:
                          ParentRecord?.service_id && record?.name
                            ? "UPDATEENV"
                            : ParentRecord?.service_id && !record?.name
                            ? "CREATEENV"
                            : "CREATESERVICE",
                        service_id: ParentRecord?.service_id,
                        service_name: ParentRecord?.last?.service_name
                          ? ParentRecord?.last?.service_name
                          : ParentRecord?.name,
                        repo: ParentRecord?.name,
                        source: ParentRecord?.html_url,
                        repo: ParentRecord?.name,
                        branch: record?.branch,
                        env_name: record?.name ? record?.name : record?.branch,
                        language: ParentRecord?.language,
                        architecture: ParentRecord?.serivce_architecture,
                        vm: {
                          id: record?.vm?.id,
                          host: record?.vm?.host,
                        },
                        environment: {
                          // ...deploy.environment,
                          // name: record?.name ? record?.name : record?.branch,
                          // vm: {
                          //   id: record?.vm?.id,
                          //   host: record?.vm?.host,
                          // },
                          // branch: record?.branch,
                          // docker_compose: environment.docker_compose,
                          // docker_file: environment.docker_file,
                          // postman: environment.postman,
                          ...environment,
                          docker_compose: environment.docker_compose.map(
                            (file) => {
                              return {
                                ...file,
                                path: file.location,
                                location: undefined,
                              };
                            }
                          ),
                          docker_file: environment.docker_file.map((file) => {
                            return {
                              ...file,
                              path: file.location,
                              location: undefined,
                            };
                          }),
                        },
                        loading: false,
                      })
                    );
                    localStorage.setItem(
                      "deploy",
                      JSON.stringify({
                        ...deploy,
                        type:
                          ParentRecord?.service_id && record?.name
                            ? "UPDATEENV"
                            : ParentRecord?.service_id && !record?.name
                            ? "CREATEENV"
                            : "CREATESERVICE",
                        service_id: ParentRecord?.service_id,
                        service_name: ParentRecord?.last?.service_name
                          ? ParentRecord?.last?.service_name
                          : ParentRecord?.name,
                        repo: ParentRecord?.name,
                        source: ParentRecord?.html_url,
                        repo: ParentRecord?.name,
                        branch: record?.branch,
                        env_name: record?.name ? record?.name : record?.branch,
                        language: ParentRecord?.language,
                        architecture: ParentRecord?.serivce_architecture,
                        vm: {
                          id: record?.vm?.id,
                          host: record?.vm?.host,
                        },
                        environment: {
                          // ...deploy.environment,
                          // name: record?.name ? record?.name : record?.branch,
                          // vm: {
                          //   id: record?.vm?.id,
                          //   host: record?.vm?.host,
                          // },
                          // branch: record?.branch,
                          ...environment,
                          docker_compose: environment.docker_compose.map(
                            (file) => {
                              return {
                                ...file,
                                path: file.location,
                                location: undefined,
                              };
                            }
                          ),
                          docker_file: environment.docker_file.map((file) => {
                            return {
                              ...file,
                              path: file.location,
                              location: undefined,
                            };
                          }),
                        },
                        loading: false,
                      })
                    );
                    navigate("/wzard?current=1");
                  }}
                >
                  <div>
                    <SettingOutlined />
                  </div>
                  <div>Setting</div>
                </div>
                <div
                  className="flex gap-1 cursor-pointer hover:text-blue-500"
                  onClick={async () => {
                    const res = await apiCaller({
                      request: vmsApi.deleteEnvService(
                        ParentRecord.service_id,
                        record.name
                      ),
                    });
                    if (res?.code) {
                      message.error(res?.errors[0].message);
                    } else {
                      await fetch();
                      message.info("DELETE SUCCESSFULLY");
                      setReload(true);
                    }
                  }}
                >
                  <DeleteOutlined />
                  <div>Delete</div>
                </div>
              </>
            ) : (
              <div
                className="flex gap-1 cursor-pointer  hover:text-blue-500"
                onClick={async () => {
                  store.dispatch(
                    setDeploy({
                      ...deploy,
                      type:
                        ParentRecord?.service_id && record?.name
                          ? "UPDATEENV"
                          : ParentRecord?.service_id && !record?.name
                          ? "CREATEENV"
                          : "CREATESERVICE",
                      service_id: ParentRecord?.service_id,
                      service_name: ParentRecord?.last?.service_name
                        ? ParentRecord?.last?.service_name
                        : ParentRecord?.name,
                      repo: ParentRecord?.name,
                      source: ParentRecord?.html_url,
                      repo: ParentRecord?.name,
                      branch: record?.branch,
                      env_name: record?.name ? record?.name : record?.branch,
                      language: ParentRecord?.language,
                      architecture: ParentRecord?.serivce_architecture,
                      vm: {
                        id: record?.vm?.id,
                        host: record?.vm?.host,
                      },
                      environment: {
                        ...deploy.environment,
                        name: record?.name ? record?.name : record?.branch,
                        vm: {
                          id: record?.vm?.id,
                          host: record?.vm?.host,
                        },
                        branch: record?.branch,
                      },
                      loading: false,
                    })
                  );
                  localStorage.setItem(
                    "deploy",
                    JSON.stringify({
                      ...deploy,
                      type:
                        ParentRecord?.service_id && record?.name
                          ? "UPDATEENV"
                          : ParentRecord?.service_id && !record?.name
                          ? "CREATEENV"
                          : "CREATESERVICE",
                      service_id: ParentRecord?.service_id,
                      service_name: ParentRecord?.last?.service_name
                        ? ParentRecord?.last?.service_name
                        : ParentRecord?.name,
                      repo: ParentRecord?.name,
                      source: ParentRecord?.html_url,
                      repo: ParentRecord?.name,
                      branch: record?.branch,
                      env_name: record?.name ? record?.name : record?.branch,
                      language: ParentRecord?.language,
                      architecture: ParentRecord?.serivce_architecture,
                      vm: {
                        id: record?.vm?.id,
                        host: record?.vm?.host,
                      },
                      environment: {
                        ...deploy.environment,
                        name: record?.name ? record?.name : record?.branch,
                        vm: {
                          id: record?.vm?.id,
                          host: record?.vm?.host,
                        },
                        branch: record?.branch,
                      },
                      loading: false,
                    })
                  );
                  navigate("/wzard");
                }}
              >
                <div>
                  <PlayCircleOutlined />
                </div>
                <div>Deploy</div>
              </div>
            )}
          </Space>
        ),
      },
    ];
    const data = ParentRecord?.branchs.map((branch, idx) => {
      return {
        key: idx.toString(),
        ...branch,
      };
    });

    return <Table columns={subColumns} dataSource={data} pagination={false} />;
  };

  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className="text-3xl font-medium">REPOSITORY DEPLOYMENT</div>
        <div className="mt-9">
          <Input
            placeholder="Enter your repository"
            prefix={
              <SearchOutlined
                className="site-form-item-icon"
                onClick={() => {}}
              />
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={async (e) => {
              setSearch(e.target.value);
              console.log(e.target.value);
              if (e.key === "Enter") {
                // const res = await apiCaller({
                //   request: vmsApi.getVmsByIds(vms_ids, e.target.value),
                // });
                // setVms(res);
              }
              if (e.target.value === "") {
                // const res = await apiCaller({
                //   request: vmsApi.getVmsByIds(vms_ids, ""),
                // });
                // setVms(res);
              }
            }}
            suffix={
              <Button
                className="text-gray-400 pointer-events-auto border-0 "
                onClick={(e) => {
                  e.preventDefault();
                  console.log(search);
                  setSearch("");
                }}
              >
                Clear
              </Button>
            }
          />
        </div>
        <div>
          <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto min-w-[1281px]">
            <Table
              columns={columns}
              loading={dataSource?.length > 0 ? false : true}
              expandable={{
                expandedRowRender: expandedRowRender,
                defaultExpandedRowKeys: ["0"],
              }}
              dataSource={dataSource}
              size="small"
            />
          </div>
        </div>
      </div>
    </>
  );
}
