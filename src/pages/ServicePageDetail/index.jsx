import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  LinkOutlined,
  MergeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, Tabs } from "antd";
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
  const [service, setService] = useState();
  const [host, setHost] = useState();
  const [records, setRecords] = useState([]);
  const [github, setGithub] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                  console.log(res);
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
  ];

  useEffectOnce(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getImagesOfServiceById(service_id, service_env),
      });
      setImages(res.result);
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
        }
      });
      socket.emit("logs", service_id, service_env);
    };
    fetch();
    console.log("first");
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

  const title_iterms = ["Event", "Logs", "Images", "Settings"];
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
                {`#${record.index} Commit: ${record.commit_id.substring(0, 6)}`}{" "}
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
      <Terminal
        name="docker-compose logs -f"
        colorMode={ColorMode.Light}
        // onInput={(terminalInput) =>
        //   console.log(`New terminal input received: '${terminalInput}'`)
        // }
      >
        {logRealTimeBuild}
      </Terminal>
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
    <div></div>,
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
      {service && <div className="h-full">
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
          <div className="col-span-6 " style={{ height: `${600}px` }}>
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
      </div>}
    </>
  );
}
