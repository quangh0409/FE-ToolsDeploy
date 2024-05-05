import { Collapse, Divider, Steps } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
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
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { setRecord } from "../../redux/reducer/record";

export default function OceanPage() {
  const [current, setCurrent] = useState(0);

  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service_id = params.get("service");
  const env_name = params.get("env");
  const record_id = params.get("record");

  const onChange = (value) => {
    setCurrent(value);
  };
  const record = useSelector((state) => state.record.record);
  const items = [
    record?.logs?.ssh?.map((log, idx) => {
      return {
        key: idx + 1,
        label: log.sub_title,
        children: <p>{`${log.mess || log.log}`}</p>,
      };
    }),
    record?.logs?.clone?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: log.sub_title,
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
          label: log.sub_title,
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
    record?.logs?.clear?.map((log, idx) => {
      if (log.log.length > 0) {
        return {
          key: idx + 1,
          label: log.sub_title,
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
          label: log.sub_title,
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
          label: log.sub_title,
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
          label: log.sub_title,
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
  useEffectOnce(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getServiceById(service_id),
      });
      setService(res);
      const token = localStorage.getItem("accessToken");
      const env = res.environment.find((e) => {
        return env_name === e.name;
      });
      if (localStorage.getItem("build") === "true") {
        localStorage.setItem("build", false);
        socket.emit("planCiCd", token, env.vm.id, res.id, env.name);
      }
      console.log(`logPlanCiCd-${localStorage.getItem("UserId")}`);
      socket.on(`logPlanCiCd-${localStorage.getItem("UserId")}`, (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        store.dispatch(setRecord(data));
      });
    };

    fetch();
  }, [service_id]);
  return (
    <>
      <div>
        <p>{service?.name}</p>
        <p>{`Branch: ${record?.branch}`}</p>
        <p>{`Bộ đếm thời gian: ${record?.created_time}`}</p>
        <p>{`Commit: ${record?.commit_id?.substring(0, 6)}`}</p>
        <p>{`${record?.commit_message}`}</p>
      </div>
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
    </>
  );
}
