import React, { useEffect, useRef, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import VMTable from "../../components/VMTable";
import "./style.css";
import Standard from "../../components/Standard";
import { useSelector } from "react-redux";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import useEffectOnce from "../../hook/useEffectOnce";
import Configuration from "../Configuration";
import { store } from "../../redux/store";
import {
  setDeploy,
  setTourConnectVM,
  setTourPipeline,
} from "../../redux/reducer/user";
import { useLocation, useNavigate } from "react-router-dom";

export default function Wzard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const intervalRef = useRef(null);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const index = params.get("current");
  let deploy = useSelector((state) => state.user.deploy);
  if (deploy?.loading) {
    deploy = JSON.parse(localStorage.getItem("deploy"));
    store.dispatch(setDeploy(deploy));
  }
  const [vms, setVms] = useState([]);
  const [vm, setVm] = useState();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (vms_ids.length > 0) {
  //     const fetch = async () => {
  //       const res = await apiCaller({
  //         request: vmsApi.getVmsByIds(vms_ids, ""),
  //       });
  //       if (!res?.code) {
  //         setVms(res);
  //         setLoading(false);
  //       } else {
  //         setLoading(true);
  //         message.error(res.errors[0].message);
  //       }
  //     };
  //     setInterval(() => {
  //       fetch();
  //     }, 3000);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [vms_ids]);

  const fetch = async (host, vms_ids) => {
    const res = await apiCaller({
      request: vmsApi.getVmsByIds(vms_ids, host),
    });
    if (!res?.code) {
      setVms(res);
      setLoading(false);
    } else {
      setLoading(true);
      message.error(res.errors[0].message);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Đợi 500ms sau khi người dùng ngừng nhập

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Effect để gọi API liên tục với giá trị debouncedSearch
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetch(debouncedSearch, vms_ids);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [debouncedSearch]);

  const steps = [
    // {
    //   title: "Standard",
    //   content: (
    //     <>
    //       <Standard />
    //     </>
    //   ),
    //   subTitle:
    //     "This step requires you to create a standard for a VM-instance, which helps you ensure the configuration requirements of the VM-instance.",
    // },
    {
      title: "VM-instance",
      content: <VMTable loading={loading} vms={vms} setVm={setVm} />,
      subTitle: (
        <>
          <div className="flex gap-1">
            <div>
              In this step, you can select an existing VM instance as the host
              or create a new VM instance as the deployment host click
            </div>
            <a
              className="text-blue-400 underline underline-offset-1 cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate("/dashboard/VM-connect");
                store.dispatch(setTourPipeline(false));
                store.dispatch(setTourConnectVM(true));
              }}
            >
              here
            </a>
          </div>
        </>
      ),
    },
    {
      title: "Configuration",
      content: (
        <>
          <Configuration />
        </>
      ),
      subTitle:
        "In this last step, you must configure the Dockerfile and docker-compose according to the existing template and edit it if you want.",
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(index | 0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <div>
      <div
        className="m-3 text-2xl"
        style={{
          lineHeight: "70px",
          //   width: "200px",
          textAlign: "center",
          //   color: token.colorTextTertiary,
          backgroundColor: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
          //   marginTop: 16,
        }}
      >
        Deploy and Pipeline CI/CD
      </div>
      <div className="m-3">{steps[current].subTitle}</div>
      <div className="flex justify-center">
        <Steps className="max-w-screen-sm" current={current} items={items} />
      </div>
      <div className="flex justify-center m-3">
        <div style={contentStyle}>{steps[current].content}</div>
      </div>
      <div
        style={{
          marginTop: 24,
        }}
        className={`flex ${
          current < steps.length - 1 ? "justify-end" : "justify-start"
        }`}
      >
        {/* {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )} */}
        {current > 0 && !index && (
          <Button
            className="text-white"
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
