import React, { useRef, useState } from "react";
import { Button, Input, Table, message } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
  SettingOutlined,
  CaretLeftOutlined,
  DeleteOutlined,
  SyncOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import useEffectOnce from "../../hook/useEffectOnce";
import { useEffect } from "react";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../utils/socket/socket";
import { addloading } from "../../redux/reducer/log";

export default function ServicePage() {
  const indexScan = useSelector((state) => state.log.loading);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [resultScan, setResultScan] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const type_ = params.get("type");
  const [services, setServices] = useState();
  const [contaniners, setContaniners] = useState();
  const [images, setImages] = useState();
  const [reload, setReload] = useState(false);
  const [vmInstance, setVmInstance] = useState();
  const [type, setType] = useState(type_ ? type_ : "services");
  const user = useSelector((state) => state.user.user_git);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const intervalRef = useRef(null);

  const fetch = async (search) => {
    const vm_instance = await apiCaller({
      request: vmsApi.getVmsById(vm),
    });
    setVmInstance(vm_instance);

    const services = await apiCaller({
      request: vmsApi.getAllServiceByVMId(
        vm,
        type === "services" ? search : undefined
      ),
    });
    setServices(services);

    const contaniners = await apiCaller({
      request: vmsApi.findContaninersOfVmById(
        vm,
        type === "containers" ? search : undefined
      ),
    });
    setContaniners(contaniners);
    setTimeout(async () => {
      const images = await apiCaller({
        request: vmsApi.findImagesOfVmById(
          vm,
          type === "images" ? search : undefined
        ),
      });
      setImages(images);
    }, 6000);
  };

  // useEffect(() => {
  //   fetch();
  //   setReload(false);
  // }, [vm, reload]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Đợi 500ms sau khi người dùng ngừng nhập

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // //Effect để gọi API liên tục với giá trị debouncedSearch
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetch(debouncedSearch);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [debouncedSearch]);

  const handleActionContainer = async (vms, container, type) => {
    const res = await apiCaller({
      request: vmsApi.actionsContainerByByVmsIdAndContainerId(
        vms,
        container,
        type
      ),
    });
    if (res?.code) {
      message.error("Error System");
    } else {
      setReload(true);
      setContaniners(res);
      message.info(`${type} successfully`);
    }
  };

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
  const columns = {
    services: [
      {
        title: "SERVICE NAME",
        key: "service_name",
        render: (record, index) => (
          <div
            onClick={() => {
              navigate(
                `/vm-instance/detail?id=${record.id}&env=${record?.environment_info[0]?.last?.env_name}`
              );
            }}
          >
            <GlobalOutlined />
            {record.name}
          </div>
        ),
      },
      {
        title: "ARCHITECTURE",
        dataIndex: "architecture",
        key: "architecture",
      },
      {
        title: "LANGUAGE",
        dataIndex: "language",
        key: "language",
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <div>
            {`${text} `}
            {text === "active" ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CheckCircleTwoTone twoToneColor="#EE9494" />
            )}
          </div>
        ),
      },
      {
        title: "LAST DEPLOYED ENVIRONMENT",
        key: "environment",
        render: (record, index) => {
          return <div>{record?.environment_info[0]?.last?.env_name}</div>;
        },
      },
      {
        title: "LAST DEPLOYED BRANCH",
        key: "branch",
        render: (record, index) => {
          return (
            <a
              className="flex gap-2 cursor-pointer hover:text-blue-500"
              href={`${record?.source.slice(0, -4)}/tree/${
                record?.environment_info[0]?.last?.branch
              }`}
            >
              {record?.environment_info[0]?.last?.branch}
            </a>
          );
        },
      },
      {
        title: "LAST DEPLOYED COMMIT",
        key: "commit",
        render: (record, index) => {
          return (
            <a
              href={record?.environment_info[0]?.last?.commit_html_url}
              className="cursor-pointer hover:text-blue-500"
            >
              <div>
                {record?.environment_info[0]?.last?.commit_id?.substring(0, 6)}
              </div>
              <div>{record?.environment_info[0]?.last?.commit_message}</div>
            </a>
          );
        },
      },
      {
        title: "LAST PIPELINE CI/CD",
        key: "index",
        render: (record) => {
          if (record?.environment_info)
            return (
              <>
                <div
                  className="flex gap-2 cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigate(
                      `/ocean?service=${record.id}&env=${record?.environment_info[0]?.last?.env_name}&name=${record?.name}&record=${record?.environment_info[0]?.last?.id}`
                    );
                  }}
                >
                  <div>
                    {record?.environment_info[0]?.last?.status ===
                    "SUCCESSFULLY" ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    )}
                  </div>
                  <div>{`#${
                    record?.environment_info[0]?.last?.index
                  } (${timeDifference(
                    record?.environment_info[0]?.last?.created_time,
                    new Date()
                  )} ago)`}</div>
                </div>
              </>
            );
        },
      },
      {
        title: "LAST DEPLOY",
        dataIndex: "last_deploy",
        key: "last_deploy",
      },
      {
        width: 100,
        title: "SETTING",
        key: "setting",
        render: (record, index) => {
          return (
            <SettingOutlined
              onClick={() => {
                const env = record.environment.find((e) => vm === e.vm);
                navigate(
                  `/new-webapp?repo=${record.repo}&user=${user}&clone_url=${record.source}&vm=${env.vm}&service=${record.id}`
                );
              }}
            />
          );
        },
      },
      {
        width: 100,
        title: "RE BUILD",
        key: "re_build",
        render: (record, index) => {
          return (
            <CaretLeftOutlined
              onClick={() => {
                // const vm = vms.find((vm) => {
                //   return vm.host === record.host;
                // });
                // navigate(`/dashboard/VM-connect?vm=${vm.id}`);
                const env_name = record.environment.find((e) => vm === e.vm);
                localStorage.setItem("build", true);
                navigate(`/ocean?service=${record.id}&env=${env_name.name}`);
              }}
            />
          );
        },
      },
      {
        width: 100,
        title: "DELETE",
        key: "delete",
        render: (record, index) => {
          return (
            <DeleteOutlined
              onClick={async () => {
                const res = await apiCaller({
                  request: vmsApi.deleteServiceById(record.id, vm),
                });
                setReload(true);
                alert(res.message);
              }}
            />
          );
        },
      },
    ],

    containers: [
      {
        title: "CONTAINER ID",
        key: "container_id",
        render: (record, index) => <div>{record.container_id}</div>,
      },
      {
        title: "NAME",
        key: "name",
        render: (record, index) => <div>{record.name}</div>,
      },
      {
        title: "CPU %",
        key: "CPUPerc",
        render: (record, index) => <div>{record.CPUPerc}</div>,
      },
      {
        title: "MEM USAGE / LIMIT",
        key: "MemUsage",
        width: 180,
        render: (record, index) => <div>{record.MemUsage}</div>,
      },
      {
        title: "MEM %",
        key: "MemPerc",
        render: (record, index) => <div>{record.MemPerc}</div>,
      },
      {
        title: "NET I/O",
        key: "NetIO",
        render: (record, index) => <div>{record.NetIO}</div>,
      },
      {
        title: "BLOCK I/O",
        key: "BlockIO",
        render: (record, index) => <div>{record.BlockIO}</div>,
      },
      {
        title: "PIDS",
        key: "PIDs",
        render: (record, index) => <div>{record.PIDs}</div>,
      },
      {
        title: "PORTS",
        key: "Ports",
        render: (record, index) => <div>{record.Ports}</div>,
      },
      {
        title: "IMAGE",
        key: "Image",
        render: (record, index) => <div>{record.Image}</div>,
      },
      {
        title: "STATUS",
        key: "Status",
        render: (record, index) => <div>{record.Status}</div>,
      },
      {
        title: "ACTIONS",
        // key: "PIDs",
        render: (record, index) => (
          <div className="flex gap-2">
            <CaretLeftOutlined
              onClick={() => {
                handleActionContainer(vm, record.container_id, "stop");
              }}
            />
            <RedoOutlined
              onClick={() => {
                handleActionContainer(vm, record.container_id, "restart");
              }}
            />
            <DeleteOutlined
              onClick={() => {
                handleActionContainer(vm, record.container_id, "delete");
              }}
            />
          </div>
        ),
      },
    ],
    images: [
      {
        title: `IMAGE NAME(REPOSITORY)`,
        key: "image_name",
        dataIndex: "Repository",
        width: 250,
      },
      {
        title: "TAG",
        dataIndex: "Tag",
        key: "tag",
        width: 100,
      },
      {
        title: "IMAGE ID",
        dataIndex: "ID",
        key: "image_id",
      },
      {
        title: "CREATED",
        dataIndex: "CreatedAt",
        key: "created",
        render: (text) => {
          return (
            <div>
              {new Date(text).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </div>
          );
        },
      },
      {
        title: "SIZE",
        dataIndex: "Size",
        key: "size",
      },
      {
        title: "ACTIONS",
        key: "actios",
        render: (record, index) => (
          <div>
            <DeleteOutlined
              onClick={async () => {
                const res = await apiCaller({
                  request: vmsApi.actionsImagesOfVmById(vm, record.ID),
                });
                if (res?.code == 0) {
                  message.info(res.message);
                } else {
                  message.error(res.message);
                }
                setReload(true);
                setImages(res.images);
              }}
            />
          </div>
        ),
      },
    ],
  };

  const expandedRowRender = (ParentRecord) => {
    const data = ParentRecord?.environment_info
      ? ParentRecord?.environment_info[0]?.containers.containers_info.map(
          (c, idx) => {
            return {
              key: idx.toString(),
              container_id: c.ID,
              name: c.Name,
              CPUPerc: c.CPUPerc,
              MemPerc: c.MemPerc,
              MemUsage: c.MemUsage,
              BlockIO: c.BlockIO,
              NetIO: c.NetIO,
              PIDs: c.PIDs,
              Ports: c.Ports,
              Image: c.Image,
              Status: c.Status,
            };
          }
        )
      : [];

    const dataImages = ParentRecord?.environment_info
      ? ParentRecord?.environment_info[0]?.images.images_info.map((i, idx) => {
          return {
            ...i,
            key: idx,
          };
        })
      : [];

    return (
      <div>
        <div>
          <Table
            columns={columns.containers}
            dataSource={data}
            scroll={{ y: 500 }}
            size="small"
            pagination={true}
          />
        </div>
        <div>
          <Table
            columns={columns.images}
            pagination={true}
            dataSource={dataImages}
            scroll={{ y: 400 }}
            size="small"
          />
        </div>
      </div>
    );
  };

  const dataSource = {
    services: services?.map((s, index) => {
      return {
        id: s.id,
        service_name: s.name,
        architecture: s.architectura,
        language: s.language,
        status: "active",
        last_deploy: new Date().toISOString(),
        key: index,
        repo: s.repo,
        source: s.source,
        user: s.user,
        environment: s.environment,
        ...s,
      };
    }),
    containers: contaniners?.map((c, index) => {
      return {
        container_id: c.ID,
        name: c.Name,
        CPUPerc: c.CPUPerc,
        MemPerc: c.MemPerc,
        MemUsage: c.MemUsage,
        BlockIO: c.BlockIO,
        NetIO: c.NetIO,
        PIDs: c.PIDs,
        Ports: c.Ports,
        Image: c.Image,
        Status: c.Status,
      };
    }),
    images: images?.map((i, index) => {
      return {
        ...i,
        key: index,
      };
    }),
  };
  const platform = () => {
    return (
      <div className="flex items-center justify-center">
        {vmInstance?.checkip?.name?.includes("Google") ? (
          <img className="w-14 bg-white" src="/images/logoGCP.png" />
        ) : vmInstance?.checkip?.name?.includes("CLOUDFLY") ? (
          <img
            className="w-14 bg-white"
            src="https://cloudfly.vn/image/logo/favicon.ico"
          />
        ) : vmInstance?.checkip?.name?.includes("Viettel") ? (
          <img
            className="w-16 bg-white"
            src="https://viettelidc.com.vn/Themes/itmetech/img/logo-IDC-2.png"
          />
        ) : (
          "N/A"
        )}
      </div>
    );
  };
  const os = () => {
    return (
      <div className="flex items-center">
        {vmInstance?.operating_system?.includes("Ubuntu") && (
          <img className="w-8" src="/images/logoUbuntu.png" />
        )}
        <div>{vmInstance?.operating_system}</div>
      </div>
    );
  };
  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className="flex items-center justify-between  text-3xl font-medium">
          <div className="flex items-center">
            {platform()} {vmInstance?.host}
          </div>
          {os()}
        </div>

        <div className="mt-9">
          <Input
            placeholder="Enter your username"
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
              if (e.key === "Enter" || e.target.value === "") {
                setSearch(e.target.value);
              }
            }}
            suffix={
              <Button
                className="text-gray-400 pointer-events-auto border-0 "
                onClick={(e) => {
                  e.preventDefault();
                  setSearch("");
                }}
              >
                Clear
              </Button>
            }
          />
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex border border-solid rounded-md w-fit">
            <div
              className="p-3 border-r cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("services");
              }}
            >
              services: <span>{services?.length}</span>
            </div>
            <div
              className="p-3 border-r cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("containers");
                socket.emit("GetContainer", localStorage.getItem("userId"), vm);
              }}
            >
              containers: <span>{contaniners?.length}</span>
            </div>
            <div
              className="p-3  cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("images");
              }}
            >
              images: <span>{images?.length}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto">
            <Table
              pagination={true}
              loading={!dataSource[`${type}`] ? true : false}
              dataSource={dataSource[`${type}`]}
              columns={columns[`${type}`]}
              scroll={{ y: 1000 }}
              size="small"
              expandable={
                type === "services"
                  ? {
                      expandedRowRender,
                      defaultExpandedRowKeys: ["0"],
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
