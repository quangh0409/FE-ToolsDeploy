import { Collapse, Divider, Steps } from "antd";
import React, { useState } from "react";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { LoadingOutlined } from "@ant-design/icons";

export default function OceanPage() {
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log("🚀 ~ onChange ~ value:", value);
    setCurrent(value);
  };
  const description = "This is a description.";

  const [logSsh, setLogSsh] = useState([]);
  const [stepLog, setStepLog] = useState([]);
  const [logClone, setLogClone] = useState([]);
  const [logScanSyntax, setLogScanSyntax] = useState([]);
  // const [logClone, setLogSsh] = useState([]);

  useEffectOnce(() => {
    socket.connect();
    socket.emit("CheckConnectVM", "10.21.21.21", "user");
    socket.on("ssh", (data) => {
      logSsh.push(data);
      setLogSsh([...logSsh]);
      if (data.status === "end" || data.status === "error") {
        stepLog.push(data);
        setStepLog([...stepLog]);
      }
    });

    socket.on("clone", (data) => {
      logClone.push(data);
      setLogClone([...logClone]);

      if (data.status === "start") {
        stepLog.push(data);
        setStepLog([...stepLog]);
        // setTimeout(() => {
        stepLog[1].status = data.status;
        setStepLog([...stepLog]);
        // }, 2000);
      }
      if (data.status === "inProcess") {
        // setTimeout(() => {
        stepLog[1].status = data.status;
        setStepLog([...stepLog]);
        // }, 2000);
      }
      //   setLogClone([...logClone, data]);
      if (data.status === "end" || data.status === "error") {
        // setTimeout(() => {
        stepLog[1].status = data.status;
        setStepLog([...stepLog]);
        // }, 5000);
      }
    });

    socket.on("ScanSyntax", (data) => {
      logScanSyntax.push(data);
      setLogScanSyntax([...logScanSyntax]);

      if (data.status === "start") {
        stepLog.push(data);
        setStepLog([...stepLog]);
        // setTimeout(() => {
        stepLog[2].status = data.status;
        setStepLog([...stepLog]);
        // }, 2000);
      }
      if (data.status === "inProcess") {
        // setTimeout(() => {
        stepLog[2].status = data.status;
        setStepLog([...stepLog]);
        // }, 8000);
      }
      if (data.status === "end" || data.status === "error") {
        // setTimeout(() => {
        stepLog[2].status = data.status;
        setStepLog([...stepLog]);
        // }, 10000);
      }
    });
  });

  console.log("🚀 ~ OceanPage ~ logSsh:", logSsh);
  console.log("🚀 ~ OceanPage ~ logClone:", logClone);
  console.log("🚀 ~ OceanPage ~ logScanSyntax:", logScanSyntax);
  console.log("🚀 ~ OceanPage ~ stepLog:", stepLog);
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    [
      {
        key: "1",
        label: "This is panel lo 1",
        children: <p>{text}</p>,
      },
      {
        key: "2",
        label: "This is panel lo 2",
        children: <p>{text}</p>,
      },
      {
        key: "3",
        label: "This is panel lo 3",
        children: <p>{text}</p>,
      },
    ],
    [
      {
        key: "1",
        label: "This is panel header 1",
        children: <p>{text}</p>,
      },
      {
        key: "2",
        label: "This is panel header 2",
        children: <p>{text}</p>,
      },
      {
        key: "3",
        label: "This is panel header 3",
        children: <p>{text}</p>,
      },
    ],
  ];
  return (
    <>
      <div className="flex justify-center">
        <Steps
          // className={`!w-[${stepLog.length * 10}px]`}
          style={{ width: `${stepLog.length * 200}px` }}
          current={current}
          onChange={onChange}
          items={stepLog.map((s) => ({
            title: s.title,
            description: s.status,
            status:
              s.status === "end" || s.status === "error" ? "finish" : "process",
            icon:
              s.status === "end" || s.status === "error" ? null : (
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
