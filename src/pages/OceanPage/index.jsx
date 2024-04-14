import { Collapse, Divider, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getServiceById } from "../../apis";
import {
  pushLogBuild,
  pushLogClear,
  pushLogClone,
  pushLogDeploy,
  pushLogRealTimeBuild,
  pushLogRealTimeClear,
  pushLogRealTimeDeploy,
  pushLogRealTimeScanImages,
  pushLogScanImages,
  pushLogScanSyntax,
  pushLogSsh,
  pushStepLog,
  setStepLog,
} from "../../redux/reducer/log";
import { store } from "../../redux/store";
import ResultTrivy from "../../components/ResultTrivy";

export default function OceanPage() {
  const [current, setCurrent] = useState(0);
  // const [logSsh, setLogSsh] = useState([]);
  // const [stepLog, setStepLog] = useState([]);
  // const [logClone, setLogClone] = useState([]);
  // const [logScanSyntax, setLogScanSyntax] = useState([]);
  // const [logClear, setClear] = useState([]);
  // const [logBuild, setBuild] = useState([]);
  // const [logScanImages, setScanImages] = useState([]);
  // const [logDeploy, setDeploy] = useState([]);
  // const [items, setItems] = useState([]);
  // const [logRealTimeBuild, setLogRealTimeBuild] = useState([]);
  // const [logRealTimeClear, setLogRealTimeClear] = useState([]);
  // const [logRealTimeDeploy, setLogRealTimeDeploy] = useState([]);
  // const [logRealTimeScanImages, setLogRealTimeScanImages] = useState([]);

  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const service_id = params.get("service");
  const env_name = params.get("env");

  const onChange = (value) => {
    setCurrent(value);
  };

  const logRealTimeBuild = useSelector((state) => state.log.logRealTimeBuild);
  const logRealTimeDeploy = useSelector((state) => state.log.logRealTimeDeploy);
  const logRealTimeScanImages = useSelector(
    (state) => state.log.logRealTimeScanImages
  );
  const logBuild = useSelector((state) => state.log.logBuild);
  const logClear = useSelector((state) => state.log.logClear);
  const logClone = useSelector((state) => state.log.logClone);
  const logDeploy = useSelector((state) => state.log.logDeploy);
  const logRealTimeClear = useSelector((state) => state.log.logRealTimeClear);
  const logScanImages = useSelector((state) => state.log.logScanImages);
  const logScanSyntax = useSelector((state) => state.log.logScanSyntax);
  const logSsh = useSelector((state) => state.log.logSsh);
  const stepLog = useSelector((state) => state.log.stepLog);

  const items = [
    logSsh.map((log, idx) => {
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess || log.log.stdout}`}</p>,
      };
    }),
    logClone.map((log, idx) => {
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess || log.log.stdout}`}</p>,
      };
    }),
    logScanSyntax.map((log, idx) => {
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess || log.log.stdout}`}</p>,
      };
    }),
    logClear.map((log, idx) => {
      if (idx === 0 || !log.sub_title) {
        return {
          key: idx + 1,
          label: log.sub_title,
          children: <p>{`${log.mess || log.log.stdout}`}</p>,
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: (
          <>
            {logRealTimeClear.map((log) => {
              return <p>{log}</p>;
            })}
          </>
        ),
      };
    }),
    logBuild.map((log, idx) => {
      if (idx === 0 || !log.sub_title) {
        return {
          key: idx + 1,
          label: log.sub_title,
          children: <p >{`${log.mess || log.log.stdout}`}</p>,
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: (
          <div className="max-h-80 overflow-y-auto">
            {logRealTimeBuild.map((log) => {
              return <p>{log}</p>;
            })}
          </div>
        ),
      };
    }),
    logScanImages.map((log, idx) => {
      if (idx === 0 || !log.sub_title) {
        return {
          key: idx + 1,
          label: log.sub_title,
          children: <p>{`${log.mess || log.log.stdout}`}</p>,
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: (
          <>
            {logRealTimeScanImages.map((l) => {
              if (log.sub_title === l.sub_title) {
                return <ResultTrivy Results={l.log.Results}/>;
              }
            })}
          </>
        ),
      };
    }),
    logDeploy.map((log, idx) => {
      if (idx === 0 || !log.sub_title) {
        return {
          key: idx + 1,
          label: log.sub_title,
          children: <p>{`${log.mess || log.log.stdout}`}</p>,
        };
      }
      return {
        key: idx + 1,
        label: log.sub_title,
        children: (
          <>
            {logRealTimeDeploy.map((log) => {
              return <p>{log}</p>;
            })}
          </>
        ),
      };
    }),
  ];
  // useEffect(() => {
  //   // setLogSsh([...logSsh]);
  //   // setLogClone([...logClone]);
  //   // setLogScanSyntax([...logScanSyntax]);
  //   // setClear([...logClear]);
  //   // setBuild([...logBuild]);
  //   // setScanImages([...logScanImages]);
  //   // setDeploy([...logDeploy]);
  //   setItems();
  //   setLoading(false);
  // }, [
  //   logRealTimeBuild,
  //   logRealTimeDeploy,
  //   logRealTimeScanImages,
  //   logBuild,
  //   logClear,
  //   logClone,
  //   logDeploy,
  //   logRealTimeClear,
  //   logScanImages,
  //   logScanSyntax,
  //   logSsh,
  // ]);
  // console.log(logRealTimeBuild, "đ");
  useEffectOnce(() => {
    const fetch = async () => {
      const res = await getServiceById(service_id);
      setService(res);
      const token = localStorage.getItem("accessToken");
      const env = res.environment.find((e) => {
        return env_name === e.name;
      });
      // socket.connect();
      /**------------------------------------------ */
      socket.emit("CheckConnectVM", token, env.vm);
      socket.on("logCheckConnectVM", (data) => {
        store.dispatch(pushLogSsh(data));
        setLoading(true);

        if (data.status === "DONE" || data.status === "ERROR") {
          store.dispatch(pushStepLog(data));
          // stepLog.push(data);
          // setStepLog([...stepLog]);
        }
        if (data.status === "DONE") {
          socket.emit("clone", token, env.vm, res.id, env.name);
        }
      });
      // /**------------------------------------------ */

      socket.on("logStepClone", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogClone(data));
        // logClone.push(data);
        // setLogClone([...logClone]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 1, status: data.status }));
          // stepLog.push(data);
          // stepLog[1].status = data.status;
          // setStepLog([...stepLog]);
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 1, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 1, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY") {
          socket.emit("scanSyntax", token, env.vm, res.id, env.name);
        }
      });
      // /**--------------------------------------------- */

      socket.on("logStepScanDockerfile", (data) => {
        store.dispatch(pushLogScanSyntax(data));
        // logScanSyntax.push(data);
        // setLogScanSyntax([...logScanSyntax]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 2, status: data.status }));
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 2, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 2, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY") {
          socket.emit("clear", token, env.vm, res.id, env.name);
        }
      });
      // /**--------------------------------------------- */
      socket.on("logRealTimeClear", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogRealTimeClear(data));
        // logRealTimeClear.push(data);
        // setLogRealTimeClear(logRealTimeClear);
        setLoading(true);
      });
      socket.on("logsStepClear", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogClear(data));
        // logClear.push(data);
        // setClear([...logClear]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 3, status: data.status }));
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 3, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 3, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY") {
          socket.emit("build", token, env.vm, res.id, env.name);
        }
      });
      // /**----------------------------------------------- */
      socket.on("logRealTimeBuild", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogRealTimeBuild(data));
        // logRealTimeBuild.push(data);
        // setLogRealTimeBuild(logRealTimeBuild);
        setLoading(true);
      });
      socket.on("logStepBuild", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogBuild(data));
        // logBuild.push(data);
        // setBuild([...logBuild]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 4, status: data.status }));
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 4, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 4, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY") {
          socket.emit("scanImages", token, env.vm, res.id, env.name);
        }
      });

      /**----------------------------------------------- */

      socket.on("logRealTimeScanImages", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogRealTimeScanImages(data));
        // logRealTimeScanImages.push(data);
        // setLogRealTimeScanImages(logRealTimeScanImages);
        setLoading(true);
      });

      socket.on("logStepScanImage", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogScanImages(data));
        // logScanImages.push(data);
        // setScanImages([...logScanImages]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 5, status: data.status }));
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 5, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 5, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY") {
          socket.emit("deploy", token, env.vm, res.id, env.name);
        }
      });

      /**----------------------------------------------- */
      socket.on("logRealTimeDeploy", (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(pushLogRealTimeDeploy(data));
        // logRealTimeDeploy.push(data);
        // setLogRealTimeDeploy(logRealTimeDeploy);
        setLoading(true);
      });
      socket.on("logStepDeploy", (data) => {
        store.dispatch(pushLogDeploy(data));
        // logDeploy.push(data);
        // setDeploy([...logDeploy]);
        setLoading(true);

        if (data.status === "START") {
          store.dispatch(pushStepLog(data));
          store.dispatch(setStepLog({ idx: 6, status: data.status }));
        }
        if (data.status === "IN_PROGRESS") {
          store.dispatch(setStepLog({ idx: 6, status: data.status }));
        }
        if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
          store.dispatch(setStepLog({ idx: 6, status: data.status }));
        }
      });
    };
    fetch();
  }, [service_id]);
  return (
    <>
      <div className="flex justify-center">
        <Steps
          style={{ width: `${stepLog.length * 200}px` }}
          current={current}
          onChange={onChange}
          items={stepLog.map((s) => ({
            title: s.title,
            description: s.status,
            status:
              s.status === "DONE" || s.status === "SUCCESSFULLY"
                ? "finish"
                : s.status === "ERROR"
                ? "error"
                : "process",
            icon:
              s.status === "DONE" ||
              s.status === "ERROR" ||
              s.status === "SUCCESSFULLY" ? null : (
                <LoadingOutlined />
              ),
          }))}
        />
      </div>

      <Divider />
      {stepLog[current] && <Collapse items={items[current]} />}
      {/* <div>{stepLog[current].log}</div> */}
    </>
  );
}
