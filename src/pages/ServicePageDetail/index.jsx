import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CaretLeftOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  LinkOutlined,
  MergeOutlined,
  RedoOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, Tabs, message } from "antd";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import githubApi from "../../apis/github.api";
import socket from "../../utils/socket/socket";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { addloading, pushLogRealTimeBuild } from "../../redux/reducer/log";
import { useDispatch, useSelector } from "react-redux";
import ResultTrivy from "../../components/ResultTrivy";
import { store } from "../../redux/store";
import useEffectOnce from "../../hook/useEffectOnce";

export default function ServicePageDetail(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const indexScan = useSelector((state) => state.log.loading);
  const params = new URLSearchParams(location.search);
  const service_id = params.get("id");
  const service_env = params.get("env");
  const [url, setUrl] = useState("quangh0409/Decision_help_system");
  const [images, setImages] = useState([]);
  const [containers, setContainers] = useState([]);
  const [service, setService] = useState();
  const [host, setHost] = useState();
  const [vm, setVm] = useState();
  const [records, setRecords] = useState([]);
  const [github, setGithub] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [resultScan, setResultScan] = useState();
  const columns = [
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
    },
    {
      title: "SIZE",
      dataIndex: "Size",
      key: "size",
    },
    {
      title: "SCAN IMAGE",
      key: "scan",
      render: (record, index) => {
        return (
          <div
            onClick={() => {
              dispatch(addloading(index?.key));
            }}
          >
            <Button
              onClick={async () => {
                const res = await apiCaller({
                  request: vmsApi.scanImageOfService(
                    service_id,
                    service_env,
                    record.Repository
                  ),
                });

                if (res) {
                  dispatch(addloading(null));
                  setResultScan(res?.Results);
                  setIsModalOpen(true);
                }
              }}
            >
              <SyncOutlined spin={indexScan === index?.key ? true : false} />
            </Button>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actios",
      render: (record, index) => {
        return (
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
        );
      },
    },
  ];

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
      setContainers(res);
      message.info(`${type} successfully`);
    }
  };

  const columns_containers = [
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
  ];

  useEffectOnce(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getImagesOfServiceById(service_id, service_env),
      });
      setImages(res.result);
      const containers_ = await apiCaller({
        request: vmsApi.getContainersOfServiceById(service_id, service_env),
      });
      setContainers(containers_.containers_);
      const records = await apiCaller({
        request: vmsApi.getRecordsOfService(service_id, service_env),
      });
      setRecords(records);
      const github = await apiCaller({
        request: githubApi.GetInfoUserGitByAccesToken(),
      });
      setGithub(github);
      const service = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(service);
      service?.environment.forEach((env) => {
        if (env.name === service_env) {
          setHost(env.vm.host);
          setVm(env.vm.id);
        }
      });
    };
    fetch();
    socket.on("docker-compose-logs", (data) => {
      if (data !== undefined && data !== "") {
        store.dispatch(
          pushLogRealTimeBuild(
            <TerminalOutput key={Math.random()}>{data}</TerminalOutput>
          )
        );
      }
    });
  }, [service_id, service_env]);
  const logRealTimeBuild = useSelector((state) => state.log.logRealTimeBuild);
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

  const title_iterms = ["Event", "Logs", "Images", "Containers",];
  const content_iterms = [
    <div className="max-h-[500px] overflow-y-auto ">
      {records.map((record, idx) => {
        return (
          <div
            key={idx}
            className={`m-2 p-2 flex flex-row border-solid border rounded-md cursor-pointer`}
            onClick={() => {
              navigate(
                `/ocean?service=${service.id}&env=${service_env}&name=${service.name}&record=${record.id}`
              );
            }}
          >
            <div className="flex mr-1">
              {record.status === "SUCCESSFULLY" ? (
                <CheckOutlined style={{ color: "Highlight" }} />
              ) : (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )}
            </div>
            <div className="grid-row flex-grow">
              <a href={`${record.commit_html_url}`}>
                {`#${record.index} Commit: ${record.commit_id.substring(0, 6)}`}
              </a>
              <div className=" flex gap-3 justify-between content-between">
                <div className="mr-4">{`${record.commit_message}`}</div>
                <div className="flex gap-3">
                  <p>
                    {record.end_time
                      ? subtractTime(record.created_time, record.end_time)
                      : `${subtractTime(record.created_time, new Date())} ago`}
                  </p>
                  <ClockCircleOutlined style={{ color: "blue" }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>,
    <div>
      <Button
        className="w-full"
        onClick={() => {
          socket.emit("logs", service_id, service_env);
          setIsOpen(true);
        }}
      >
        View log
      </Button>
      {isOpen && (
        <Terminal
          name="docker-compose logs -f"
          colorMode={ColorMode.Light}
        >
          {logRealTimeBuild}
        </Terminal>
      )}
    </div>,
    <div>
      <Table
        pagination={false}
        dataSource={images?.map((i, index) => {
          return {
            ...i,
            key: index,
          };
        })}
        columns={columns}
        scroll={{ y: 421 }}
      />
    </div>,
    <div>
      <Table
        pagination={false}
        dataSource={containers?.map((i, index) => {
          return {
            ...i,
            container_id: i.ID,
            name: i.Name,
            key: index,
          };
        })}
        columns={columns_containers}
        scroll={{ y: 421 }}
      />
    </div>,
  ];
  return (
    <>
      <Modal
        open={isModalOpen}
        footer={false}
        onCancel={() => setIsModalOpen(false)}
        closeIcon={true}
        width={1500}
      >
        <ResultTrivy Results={resultScan} y={500} />;
      </Modal>
      {service ? (
        <div className="h-full">
          <div className="ml-24 mr-24 mb-10 ">
            <div className=" text-3xl font-medium">
              <GlobalOutlined />
              {service?.name}
            </div>
            <div className=" mt-2 ">
              <div className="flex flex-row grid-row-3 items-center  w-auto ">
                <img
                  className="row-span-1 w-6"
                  src="/images/github.png"
                  alt="logo"
                />
                <div className="row-span-2 flex flex-row ">
                  <a
                    href={`https://github.com/${github?.login}/${service?.repo}/tree/${service_env}`}
                    className="underline  underline-offset-1 w-full"
                  >
                    {`${github?.login}/${service?.repo}`}
                    <MergeOutlined />
                    {service_env}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className=" mt-2 ">
                <div className="flex items-center gap-2">
                  <LinkOutlined />
                  <div className="flex  gap-4">
                    <a href="#cscs" className="underline  underline-offset-1">
                      {host}
                    </a>
                    <CopyOutlined
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-24 mr-24 h-full grid grid-cols-6 gap-4 ">
            <div className="col-span-6 h-full">
              <Tabs
                className="w-full h-full"
                tabPosition={"left"}
                items={title_iterms.map((t, i) => {
                  return {
                    label: `${t}`,
                    key: i,
                    children: content_iterms[i],
                  };
                })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <img className="w-8" src="/images/loading.gif"></img>
        </div>
      )}
    </>
  );
}
