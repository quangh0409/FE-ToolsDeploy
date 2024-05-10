import { Button, Collapse, Divider, Steps, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import ResultTrivy from "../../components/ResultTrivy";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { setRecord } from "../../redux/reducer/record";
// const fs = require("fs");
import * as fs from "fs";

export default function OceanPage() {
  const [current, setCurrent] = useState(0);

  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [postman, setPostman] = useState();
  const [timer, setTimer] = useState(new Date());
  const countRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service_id = params.get("service");
  const env_name = params.get("env");
  const record_id = params.get("record");
  countRef.current = setInterval(() => {
    setTimer(new Date());
  }, 1000);
  const onChange = (value) => {
    setCurrent(value);
  };
  const record = useSelector((state) => state.record.record);
  const items = [
    record?.logs?.ssh?.map((log, idx) => {
      return {
        key: idx + 1,
        label: (
          <p className="flex justify-between">
            {log.sub_title}{" "}
            <span className="flex items-center gap-1">
              <img className="h-4" src="/images/stopwatch.png" alt="logo" />
              {log?.end_time
                ? timeDifference(log?.start_time, log?.end_time)
                : timeDifference(log?.start_time, timer)}
            </span>
          </p>
        ),
        children: <p>{`${log.mess || log.log}`}</p>,
      };
    }),
    record?.logs?.clone?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <div className="max-h-80 overflow-y-auto">
              {log.log.map((l, idx) => {
                return <p key={idx}>{l}</p>;
              })}
            </div>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
    record?.logs?.scanSyntax?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <div className="max-h-80 overflow-y-auto">
              {log.log.map((l, idx) => {
                console.log("🚀 ~ {log.log.map ~ l:", l);
                const columns = [
                  {
                    title: "Code",
                    dataIndex: "code",
                    key: "code",
                    width: 70,
                  },
                  {
                    title: "Level",
                    dataIndex: "level",
                    key: "level",
                    width: 70,
                    render: (text) => (
                      <p
                        className={`${
                          text === "info"
                            ? "text-blue-400"
                            : text === "error"
                            ? "text-red-500"
                            : "text-yellow-400"
                        }`}
                      >
                        {text}
                      </p>
                    ),
                  },
                  {
                    title: "Line",
                    dataIndex: "line",
                    key: "line",
                    width: 70,
                  },
                  {
                    title: "Message",
                    dataIndex: "message",
                    key: "message",
                  },
                ];
                // const data = (l !== "") ? JSON.parse(l) : [];
                // const dataTable =
                //   data.length &&
                //   data.map((val, index) => {
                //     return {
                //       ...val,
                //       key: index,
                //     };
                //   });
                return (
                  <div
                    key={idx}
                    className="col-span-1 border rounded-lg h-full overflow-auto"
                  >
                    {/* <Table
                      pagination={false}
                      dataSource={dataTable}
                      columns={columns}
                      scroll={{ y: 421 }}
                    /> */}
                  </div>
                );
              })}
            </div>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
    record?.logs?.clear?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <div className="max-h-80 overflow-y-auto">
              {log.log.map((l, idx) => {
                return <p key={idx}>{l}</p>;
              })}
            </div>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
    record?.logs?.build?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <div className="max-h-80 overflow-y-auto">
              {log.log.map((l, idx) => {
                return <p key={idx}>{l}</p>;
              })}
            </div>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
    record?.logs?.scanImages?.map((log, idx) => {
      if (log.log.length > 0 && log.log[0] !== "") {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <>
              <ResultTrivy Results={JSON.parse(log.log[0])?.Results} />;
            </>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
    record?.logs?.deploy?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: (
            <p className="flex justify-between">
              {log.sub_title}{" "}
              <span className="flex items-center gap-1">
                <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                {log?.end_time
                  ? timeDifference(log?.start_time, log?.end_time)
                  : timeDifference(log?.start_time, timer)}
              </span>
            </p>
          ),
          children: (
            <div className="max-h-80 overflow-y-auto">
              {log.log.map((l, idx) => {
                return <p key={idx}>{l}</p>;
              })}
            </div>
          ),
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess}`}</p>,
      };
    }),
  ];
  useEffect(() => {
    if (record.status === "SUCCESSFULLY" && service) {
      const env = service?.environment.find((env) => env.name === env_name);
      const fecth = async () => {
        const res = await apiCaller({
          request: vmsApi.runPostman(
            env?.postman?.collection?.content,
            env?.postman?.environment?.content,
            service?.name,
            env_name,
            env?.branch
          ),
        });
        setPostman(res);
      };
      fecth();
    }
  }, [record, service]);
  useEffectOnce(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(res);
      const token = localStorage.getItem("accessToken");
      const env = res?.environment.find((e) => {
        return env_name === e.name;
      });
      if (localStorage.getItem("build") === "true") {
        localStorage.setItem("build", false);
        socket.emit("planCiCd", token, env.vm.id, res.id, env.name);
      }
      socket.on(`logPlanCiCd-${localStorage.getItem("UserId")}`, (data) => {
        store.dispatch(setRecord(data));
      });
    };
    const fetchRecord = async () => {
      const res = await apiCaller({
        request: vmsApi.getRecordById(record_id),
      });
      store.dispatch(setRecord(res));
      const service = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(service);
    };

    if (record_id) {
      fetchRecord();
    } else {
      fetch();
    }
  }, [service_id, record_id]);

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
  return (
    <>
      <div className="h-scree w-full">
        {service && record && (
          <div
            className={`p-2 mb-2 ${
              record?.status === "SUCCESSFULLY"
                ? "bg-green-400"
                : record?.status === "ERROR"
                ? "bg-red-400"
                : "bg-blue-400"
            }`}
          >
            <p>{service?.name}</p>
            <div className="grid grid-cols-3 gap-4">
              <p className="">{`Branch: ${record?.branch}`}</p>
              <p className="">
                <ClockCircleOutlined style={{ color: "blue" }} />
                {`${timeDifference(record?.created_time, new Date())} ago`}
              </p>
              <p></p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <p>{`Commit: ${record?.commit_id?.substring(0, 6)}`}</p>
              {record?.end_time ? (
                <div className="flex items-center">
                  {/* <ClockCircleOutlined style={{ color: "blue" }} /> */}
                  <img className="h-4" src="/images/stopwatch.png" alt="logo" />
                  <div>{`${timeDifference(
                    record?.created_time,
                    record?.end_time
                  )}`}</div>
                </div>
              ) : (
                <p></p>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    // const vm = vms.find((vm) => {
                    //   return vm.host === record.host;
                    // });
                    // navigate(`/dashboard/VM-connect?vm=${vm.id}`);
                    localStorage.setItem("build", true);
                    window.location.href = `/ocean?service=${service_id}&env=${env_name}&name=${service?.name}`;
                  }}
                >
                  re-build
                </Button>
                <Button
                  onClick={() => {
                    const env = service.environment.find(
                      (env) => env.name === env_name
                    );
                    const fecth = async () => {
                      const res = await apiCaller({
                        request: vmsApi.runPostman(
                          env?.postman?.collection?.content,
                          env?.postman?.environment?.content,
                          service?.name,
                          env_name,
                          env?.branch
                        ),
                      });
                      setPostman(res);
                    };
                    fecth();
                  }}
                >
                  run test
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p>{`${record?.commit_message}`}</p>
              <p></p>
              <p></p>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Steps
            style={{
              width: `${Object.keys(record?.ocean || {}).length * 200}px`,
            }}
            current={current}
            onChange={onChange}
            items={Object.keys(record?.ocean || {}).map((s) => ({
              title: record?.ocean[s].title,
              description: record?.ocean[s].status,
              status:
                record?.ocean[s].status === "DONE" ||
                record?.ocean[s].status === "SUCCESSFULLY"
                  ? "finish"
                  : record?.ocean[s].status === "ERROR"
                  ? "error"
                  : "process",
              icon:
                record?.ocean[s].status === "DONE" ||
                record?.ocean[s].status === "ERROR" ||
                record?.ocean[s].status === "SUCCESSFULLY" ? null : (
                  <LoadingOutlined />
                ),
            }))}
          />
        </div>

        <Divider />
        {Object.keys(record?.ocean || {})[current] && (
          <Collapse items={items[current]} />
        )}
        <iframe
          // src="./images/test.html"
          loading={postman ? false : true}
          className="h-[800px] w-full"
          srcDoc={postman}
        ></iframe>
      </div>
    </>
  );
}
