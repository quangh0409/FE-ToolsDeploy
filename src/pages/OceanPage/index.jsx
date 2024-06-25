import {
  Button,
  Collapse,
  Divider,
  Modal,
  Steps,
  Table,
  Upload,
  message,
} from "antd";
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
import Icon from "@ant-design/icons/lib/components/Icon";

export default function OceanPage() {
  const [current, setCurrent] = useState(0);
  const negative = useNavigate();
  const [service, setService] = useState();
  const [postman, setPostman] = useState();
  const [postmanNew, setPostmanNew] = useState({
    isAddPostman: false,
    html: undefined,
    loading: false,
  });
  const [postmanStatus, setPostmanStatus] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [timer, setTimer] = useState(new Date());
  const countRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service_id = params.get("service");
  const env_name = params.get("env");
  const record_id = params.get("record");
  const record = useSelector((state) => state.record.record);
  const [fileListC, setFileListC] = useState([
    // {
    //   uid: 1,
    //   // name: "",
    // },
  ]);
  const [fileListE, setFileListE] = useState([
    // {
    //   uid: 1,
    // },
  ]);
  countRef.current = setInterval(() => {
    setTimer(new Date());
  }, 1000);

  const propsC = {
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

  useEffect(() => {
    const fetch = async () => {
      const env = service?.environment.find((env) => {
        return env.name === env_name;
      });
      if (
        record.status === "SUCCESSFULLY" &&
        env?.postman?.collection?.content &&
        env?.postman?.environment?.content &&
        env?.branch &&
        service?.name
      ) {
        localStorage.setItem("build", true);
        setPostmanStatus(true);
        setisModal(true);
      } else if (
        record.status === "SUCCESSFULLY" &&
        !env?.postman?.collection?.content
      ) {
        setPostmanNew({ ...postmanNew, isAddPostman: true });
      }
    };
    fetch();
  }, [record]);
  const onChange = (value) => {
    setCurrent(value);
  };
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
                const data = l.startsWith("[") ? JSON.parse(l) : [];
                const dataTable =
                  data.length &&
                  data.map((val, index) => {
                    return {
                      ...val,
                      key: index,
                    };
                  });
                return (
                  <div
                    key={idx}
                    className="col-span-1 border rounded-lg h-full overflow-auto"
                  >
                    <Table
                      pagination={false}
                      dataSource={dataTable}
                      columns={columns}
                      scroll={{ y: 421 }}
                    />
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
                  : timeDifference(log?.start_time | new Date(), timer)}
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
    if (postmanStatus) {
      const env = service?.environment.find((env) => {
        return env.name === env_name;
      });
      const fecth = async () => {
        if (
          env?.postman?.collection?.content &&
          env?.postman?.environment?.content &&
          env?.branch &&
          service?.name
        ) {
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
          setPostmanStatus(false);
        }
      };
      setTimeout(() => {
        fecth();
      }, 10000);
    }
  }, [postmanStatus, record]);

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
        socket.emit("planCiCd", token, env.vm.id, service_id, env.name);
      }
      socket.on(`logPlanCiCd-${localStorage.getItem("UserId")}`, (data) => {
        if (!postmanStatus) {
          store.dispatch(setRecord(data));
        }
      });
      socket.on(
        `logPlanCiCd-${localStorage.getItem("UserId")}-deploy`,
        (data) => {
          if (!postmanStatus) {
            store.dispatch(setRecord(data));
          }
          // if (data.status === "SUCCESSFULLY") {
          //   setPostmanStatus(true);
          //   negative(
          //     `/ocean?service=${service_id}&env=${env_name}&name=${service?.name}&record=${record.id}`
          //   );
          // }
        }
      );
    };
    const fetchRecord = async () => {
      const res = await apiCaller({
        request: vmsApi.getRecordById(record_id),
      });
      store.dispatch(setRecord(res));
      const serviceR = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(serviceR);
      const env = serviceR?.environment.find((env) => {
        return env.name === env_name;
      });
      const fecthE = async () => {
        if (
          env &&
          env?.postman?.collection?.content &&
          env?.postman?.environment?.content
        ) {
          const res = await apiCaller({
            request: vmsApi.runPostman(
              env?.postman?.collection?.content,
              env?.postman?.environment?.content,
              serviceR?.name,
              env_name,
              env?.branch
            ),
          });
          setPostman(res);
        }
      };
      if (res.status === "SUCCESSFULLY") {
        fecthE();
      }
    };

    if (record_id) {
      fetchRecord();
    } else {
      fetch();
    }
  }, [service_id, record_id, postmanStatus]);

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
                  disabled={record.status !== "SUCCESSFULLY"}
                  onClick={() => {
                    localStorage.setItem("build", true);
                    window.location.href = `/ocean?service=${service_id}&env=${env_name}&name=${service?.name}`;
                  }}
                >
                  re-build
                </Button>
                <Button
                  onClick={() => {
                    setPostmanStatus(true);
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

        <Modal
          open={postmanStatus || !!postman}
          footer={false}
          onCancel={() => {
            setPostmanStatus(false);
            setPostman(undefined);
          }}
          closeIcon={true}
          width={1500}
        >
          {postmanStatus && !!postman === false ? (
            <div className="flex justify-center">
              <img className="w-7" src="/images/loading.gif" />{" "}
              <p>Running Postman test</p>
            </div>
          ) : (
            <iframe
              // src="./images/test.html"
              loading={"eager"}
              className="h-[800px] w-full mt-8"
              srcDoc={postman}
            ></iframe>
          )}
        </Modal>

        <Modal
          open={postmanNew.isAddPostman}
          footer={false}
          onCancel={() => {
            setPostmanNew({ ...postmanNew, isAddPostman: false });
          }}
          closeIcon={true}
          width={postmanNew?.html ? 1500 : 800}
        >
          <div className="w-full mb-5">
            <div className="h-full mb-5">
              <h2>Do you want to test postman api ?</h2>
            </div>
            <div className="w-8/12 ">
              <div className="flex gap-2 m-2">
                <span className="col-span-1 w-[78px]">Collection</span>
                <Upload
                  {...propsC}
                  // defaultFileList={[...fileListC]}
                  fileList={[...fileListC]}
                  className="flex gap-4"
                  beforeUpload={(file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = (e) => {
                        try {
                          setFileListC([
                            {
                              ...file,
                              name: file.name,
                              content: e.target.result.split(",")[1],
                            },
                          ]);
                        } catch (error) {
                          console.error("Lỗi khi đọc file JSON:", error);
                        }
                      };
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Upload
                  </Button>
                </Upload>
              </div>
              <div className="flex gap-2 m-2">
                <span className="col-span-1">Environment</span>
                <Upload
                  {...propsE}
                  className="flex gap-4"
                  // defaultFileList={[...fileListE]}
                  fileList={[...fileListE]}
                  beforeUpload={(file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = (e) => {
                        try {
                          setFileListE([
                            {
                              ...file,
                              name: file.name,
                              content: e.target.result.split(",")[1],
                            },
                          ]);
                        } catch (error) {
                          console.error("Lỗi khi đọc file JSON:", error);
                        }
                      };
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Upload
                  </Button>
                </Upload>
              </div>
            </div>
            <div className="flex justify-end text-center">
              {postmanNew.loading ? (
                <div className="flex">
                  <img className="w-5" src="/images/loading.gif" />
                  <p>Running postman test...</p>
                </div>
              ) : (
                <></>
              )}
              <div>
                <Button
                  onClick={async () => {
                    setPostmanNew({ ...postmanNew, loading: true });
                    const env = service?.environment.find((env) => {
                      return env.name === env_name;
                    });
                    if (env?.branch && service?.name) {
                      const res = await apiCaller({
                        request: vmsApi.runPostman(
                          fileListC[0]?.content,
                          fileListE[0]?.content,
                          service?.name,
                          env_name,
                          env?.branch
                        ),
                      });
                      if (res?.code) {
                        message.error(res.errors[0]?.message);
                        setPostmanNew({
                          ...postmanNew,
                          loading: false,
                        });
                      } else {
                        setPostmanNew({
                          ...postmanNew,
                          html: res,
                          loading: false,
                        });
                      }
                    }
                  }}
                >
                  Test
                </Button>
              </div>
            </div>
            {postmanNew?.html ? (
              <iframe
                // src="./images/test.html"
                loading={"eager"}
                className="h-[800px] w-full mt-8"
                srcDoc={postmanNew.html}
              ></iframe>
            ) : (
              <></>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}
