import React, { useEffect, useState } from "react";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { useLocation } from "react-router-dom";
import { Button, Checkbox, Input, Radio } from "antd";
import { createVMS } from "../../apis/vms.api";
import { UpdateTicket, UpdateVMs } from "../../apis";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
export default function ConnectVM() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const [resultSsh, setResultSsh] = useState();

  const [logInstallHadolint, setLogInstallHadolint] = useState([]);
  const [logInstallTrivy, setLogInstallTrivy] = useState([]);
  const [logInstallDocker, setLogInstallDocker] = useState([]);

  const [hostVM, setHostVM] = useState();
  const [userVM, setUserVM] = useState();
  const [passVM, setPassVM] = useState();
  const [vmId, setVmId] = useState();

  const [loadingDocker, setLoadingDocker] = useState(false);
  const [loadingTrivy, setLoadingTrivy] = useState(false);
  const [loadingHadolint, setLoadingHadolint] = useState(false);

  const [checkDocker, setCheckDocker] = useState(false);
  const [checkHadolint, setCheckHadolint] = useState(false);
  const [checkTrivy, setCheckTrivy] = useState(false);

  useEffectOnce(() => {
    setVmId(vm);
    socket.connect();
    socket.on("logCheckConnectVM", (data) => {
      setResultSsh(data);
    });
    socket.on("logInstallDocker", (data) => {
      console.log("🚀 ~ socket.on logInstallDocker ~ data:", data);
      logInstallDocker.push(data);
      setLogInstallDocker([...logInstallDocker]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setLoadingDocker(false);
      }
    });
    socket.on("logInstallTrivy", (data) => {
      logInstallTrivy.push(data);
      setLogInstallTrivy([...logInstallTrivy]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setLoadingTrivy(false);
      }
      console.log("🚀 ~ socket.on logInstallTrivy ~ data:", data);
    });
    socket.on("logInstallHadolint", (data) => {
      logInstallHadolint.push(data);
      setLogInstallHadolint([...logInstallHadolint]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setLoadingHadolint(false);
      }
      console.log("🚀 ~ socket.on logInstallHadolint ~ data:", data);
    });
  }, [vm]);

  const onChangeDocker = (e) => {
    setCheckDocker(e.target.checked);
  };
  const onChangeHadolint = (e) => {
    setCheckHadolint(e.target.checked);
  };
  const onChangeTrivy = (e) => {
    setCheckTrivy(e.target.checked);
  };

  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className=" text-3xl font-medium">VM instance</div>
        <div className=" text-xl font-medium mt-6">
          Follow the instructions to connect your remote VM
        </div>
        <div>
          <div className="flex m-1">
            <p className="mr-1">Host</p>
            <Input
              placeholder="0.0.0.0"
              className="w-40"
              onChange={(e) => {
                setHostVM(e.target.value);
              }}
            />
          </div>
          <div className="flex m-1">
            <p className="mr-1">User</p>
            <Input
              placeholder="user name"
              className="w-40"
              onChange={(e) => {
                setUserVM(e.target.value);
              }}
            />
          </div>
          <div className="flex m-1">
            <p className="mr-1">Pass</p>
            <Input
              placeholder="user name"
              className="w-40"
              onChange={(e) => {
                setPassVM(e.target.value);
              }}
            />
          </div>
          <div className="flex-none w-40">
            <Radio.Button
              value="default"
              onClick={() => {
                const fetch = async () => {
                  const vm = await createVMS(hostVM, userVM, passVM);
                  if (vm) {
                    alert("success full");
                  }
                  await UpdateTicket(vm.id, undefined);
                  setVmId(vm.id);
                };
                fetch();
              }}
            >
              Register
            </Radio.Button>
          </div>
        </div>
        <div className="border-solid border border-gray-500 font mt-6 rounded-md">
          <p>{`(set sudo role for user)`}</p>
          <p>sudo visudo</p>
          <p>your_username ALL=(ALL:ALL) ALL</p>
          <p>
            &gt;&gt; curl -o id_rsa.pub
            http://35.213.167.216:8000/api/v1/vms/download/key/pub
          </p>
          <p>
            &gt;&gt; mkdir -p ~/.ssh (You can skip this step if you already have
            a .ssh directory)
          </p>
          <p>&gt;&gt; cat id_rsa.pub &gt;&gt; ~/.ssh/authorized_keys</p>
          <p>&gt;&gt; chmod 600 ~/.ssh/authorized_keys</p>
        </div>
        <div className="flex mt-2">
          <div className="flex-none w-40">
            <Radio.Button
              value="default"
              onClick={() => {
                const token = localStorage.getItem("accessToken");

                socket.emit("CheckConnectVM", token, vmId);
              }}
            >
              check connect
            </Radio.Button>
          </div>
          {resultSsh?.status ? (
            resultSsh?.status === "ok" ? (
              <div className="flex-1">
                <CheckOutlined className="rounded-full text-green-600 border-2 border-green-500 " />
                {resultSsh?.mess}
              </div>
            ) : (
              <div className="flex-1">
                <CloseOutlined className="rounded-full text-red-600 border-2 border-red-500 " />
                {resultSsh?.mess}
              </div>
            )
          ) : (
            <div className="flex-1 "></div>
          )}
        </div>
        <div className="mt-4">
          <p></p>
          <div className="flex">
            <div>
              <div className="flex flex-col">
                <div className="flex">
                  <Checkbox onChange={onChangeDocker}>Docker</Checkbox>{" "}
                  {loadingDocker && checkDocker ? <p>loading</p> : null}
                </div>
                <div className="flex">
                  <Checkbox onChange={onChangeHadolint}>Hadolint</Checkbox>
                  {loadingHadolint && checkHadolint ? <p>loading</p> : null}
                </div>
                <div className="flex">
                  <Checkbox onChange={onChangeTrivy}>Trivy</Checkbox>
                  {loadingTrivy && checkTrivy ? <p>loading</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-3 w-40">
                <Button
                  disabled={
                    loadingDocker || loadingHadolint || loadingTrivy
                      ? true
                      : false
                  }
                  value="default"
                  onClick={() => {
                    const token = localStorage.getItem("accessToken");
                    if (checkDocker) {
                      socket.emit("InstallDocker", token, vmId);
                      setLoadingDocker(true);
                    }
                    if (checkTrivy) {
                      socket.emit("InstallTrivy", token, vmId);
                      setLoadingTrivy(true);
                    }
                    if (checkHadolint) {
                      socket.emit("InstallHadolint", token, vmId);
                      setLoadingHadolint(true);
                    }
                  }}
                >
                  Set up enviroment
                </Button>
              </div>
            </div>

            <div className="flex-1 ">
              <div className="border-solid border border-gray-500 font rounded-md h-48 overflow-auto"></div>
              <div className="flex mt-3">
                <div className="flex-none">
                  <Radio.Button
                    // className="w-fit"
                    value="default"
                    onClick={() => {
                      // socket.connect()
                      // socket.on("check docker", (result) => {
                      //  setResultDocker(result)
                      //
                      // })
                    }}
                  >
                    check
                  </Radio.Button>
                </div>
                <div className="flex-1 ml-9 justify-center">kết quả{}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
