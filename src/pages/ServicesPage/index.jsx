import React, { useState } from "react";
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
  const [services, setServices] = useState([]);
  const [contaniners, setContaniners] = useState([]);
  const [images, setImages] = useState([]);
  const [reload, setReload] = useState(false);
  const [vmInstance, setVmInstance] = useState();
  const [search, setSearch] = useState();
  const [type, setType] = useState("services");
  const user = useSelector((state) => state.user.user_git);
  useEffectOnce(() => {
    const fetch = async () => {
      const vm_instance = await apiCaller({
        request: vmsApi.getVmsById(vm),
      });
      setVmInstance(vm_instance);

      const services = await apiCaller({
        request: vmsApi.getAllServiceByVMId(vm),
      });
      setServices(services);

      const contaniners = await apiCaller({
        request: vmsApi.findContaninersOfVmById(vm, undefined),
      });
      setContaniners(contaniners);
      setTimeout(async () => {
        const images = await apiCaller({
          request: vmsApi.findImagesOfVmById(vm, undefined),
        });
        setImages(images);
      }, 6000);
    };

    fetch();
    setReload(false);
  }, [vm, reload]);

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
      setContaniners(res);
      message.info(`${type} successfully`);
    }
  };
  const columns = {
    services: [
      {
        title: "SERVICE NAME",
        key: "service_name",
        render: (record, index) => (
          <div
            onClick={() => {
              const env = record.environment.find((e) => e.vm === vm);
              navigate(`/vm-instance/detail?id=${record.id}&env=${env.name}`);
            }}
          >
            <GlobalOutlined />
            {record.service_name}
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
        title: "ENVIRONMENT",
        key: "environment",
        render: (record, index) => {
          const env = record.environment?.find((e) => e.vm === vm);
          return <div>{env.name}</div>;
        },
      },
      {
        title: "LAST DEPLOY",
        dataIndex: "last_deploy",
        key: "last_deploy",
      },
      {
        width: 100,
        title: "Setting",
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
        title: "Re Build",
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
        title: "Delete",
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
        title: "Ports",
        key: "Ports",
        render: (record, index) => <div>{record.Ports}</div>,
      },
      {
        title: "Image",
        key: "Image",
        render: (record, index) => <div>{record.Image}</div>,
      },
      {
        title: "Status",
        key: "Status",
        render: (record, index) => <div>{record.Status}</div>,
      },
      {
        title: "Actions",
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
        title: "Actions",
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

                setImages(res.images);
              }}
            />
          </div>
        ),
      },
    ],
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
        {vmInstance?.kernel?.includes("gcp") ? (
          <img className="w-12 bg-white" src="/images/logoGCP.png" />
        ) : vmInstance?.kernel?.includes("generic") ? (
          <img className="w-12 bg-white" src="/images/logoAzure.png" />
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
  console.log(`${type}`, dataSource[`${type}`].length);
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
              setSearch(e.target.value);
              console.log(e.target.value);
              if (e.key === "Enter") {
                if (type === "services") {
                  const res = await apiCaller({
                    request: vmsApi.findServiceInVmsByName(vm, e.target.value),
                  });
                  setServices(res);
                } else if (type === "containers") {
                  const contaniners = await apiCaller({
                    request: vmsApi.findContaninersOfVmById(vm, search),
                  });
                  setContaniners(contaniners);
                } else if (type === "images") {
                  const images = await apiCaller({
                    request: vmsApi.findImagesOfVmById(vm, search),
                  });
                  setImages(images);
                }
              }
              if (e.target.value === "") {
                if (type === "services") {
                  const res = await apiCaller({
                    request: vmsApi.findServiceInVmsByName(vm, e.target.value),
                  });
                  setServices(res);
                } else if (type === "containers") {
                  const contaniners = await apiCaller({
                    request: vmsApi.findContaninersOfVmById(vm, search),
                  });
                  setContaniners(contaniners);
                } else if (type === "images") {
                  const images = await apiCaller({
                    request: vmsApi.findImagesOfVmById(vm, search),
                  });
                  setImages(images);
                }
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
        <div className="flex justify-end mt-2">
          <div className="flex border border-solid rounded-md w-fit">
            <div
              className="p-3 border-r cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("services");
              }}
            >
              services: <span>{services.length}</span>
            </div>
            <div
              className="p-3 border-r cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("containers");
                socket.emit("GetContainer", localStorage.getItem("userId"), vm);
              }}
            >
              containers: <span>{contaniners.length}</span>
            </div>
            <div
              className="p-3  cursor-pointer hover:text-blue-400"
              onClick={() => {
                setType("images");
              }}
            >
              images: <span>{images.length}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto">
            <Table
              pagination={false}
              loading={dataSource[`${type}`].length === 0 ? true : false}
              dataSource={dataSource[`${type}`]}
              columns={columns[`${type}`]}
              scroll={{ y: 421 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
