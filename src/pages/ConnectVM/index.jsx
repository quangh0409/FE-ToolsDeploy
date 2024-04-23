import React, { useEffect, useState } from "react";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { useLocation } from "react-router-dom";
import { Button, Input, Form, Modal, Carousel, Card, message } from "antd";
import vmsApi from "../../apis/vms.api";
import "./style.css";
import apiCaller from "../../apis/apiCaller";
import ticketApi from "../../apis/ticket.api";
export default function ConnectVM() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const [form] = Form.useForm();
  const [resultSsh, setResultSsh] = useState();

  const [logInstallHadolint, setLogInstallHadolint] = useState([]);
  const [logInstallTrivy, setLogInstallTrivy] = useState([]);
  const [logInstallDocker, setLogInstallDocker] = useState([]);

  const [hostVM, setHostVM] = useState();
  const [userVM, setUserVM] = useState();
  const [passVM, setPassVM] = useState();
  const [vmId, setVmId] = useState();

  const [versionDocker, setVersionDocker] = useState();
  const [versionHadolint, setVersionHadolint] = useState();
  const [versionTrivy, setVersionTrivy] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoVms, setInfoVms] = useState();
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    setVersionDocker(infoVms?.set_up?.docker);
    setVersionHadolint(infoVms?.set_up?.hadolint);
    setVersionTrivy(infoVms?.set_up?.trivy);
    if (infoVms !== undefined) {
      setIsOpen(true);
    }
  }, [infoVms]);

  const checkInstall = () => {
    if (versionDocker === "" || versionHadolint === "" || versionTrivy === "") {
      versionDocker === ""
        ? message.warning("Còn thiếu Docker")
        : setIsOpen(true);
      versionHadolint === ""
        ? message.warning("Còn thiếu Hadolint")
        : setIsOpen(true);
      versionTrivy === ""
        ? message.warning("Còn thiếu Trivy")
        : setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  console.log(isOpen);
  useEffectOnce(() => {
    setVmId(vm);
    if (vm) {
      const fetch = async () => {
        const res = await apiCaller({
          request: vmsApi.getVmsById(vm),
        });
        setInfoVms(res);
        setHostVM(res.host);
      };
      setVmId(vm);
      fetch();
    }
    socket.connect();
    socket.on("logCheckConnectVM", (data) => {
      setResultSsh(data);
    });
    socket.on("logInstallDocker", (data) => {
      logInstallDocker.push({
        key: logInstallDocker.length + 1,
        label: data.title,
        children: <p>{data.mess || data?.log?.stdout}</p>,
      });
      setLogInstallDocker([...logInstallDocker]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setVersionDocker(data?.log?.stdout);
      }
    });
    socket.on("logInstallTrivy", (data) => {
      logInstallTrivy.push({
        key: logInstallTrivy.length + 1,
        label: data.title,
        children: <p>{data.mess || data?.log?.stdout || data?.log?.stderr}</p>,
      });
      setLogInstallTrivy([...logInstallTrivy]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setVersionTrivy(data?.log?.stdout);
      }
    });
    socket.on("logInstallHadolint", (data) => {
      logInstallHadolint.push({
        key: logInstallHadolint.length + 1,
        label: data.title,
        children: <p>{data.mess || data?.log?.stdout || data?.log?.stderr}</p>,
      });
      setLogInstallHadolint([...logInstallHadolint]);
      if (data.status === "SUCCESSFULLY" || data.status === "ERROR") {
        setVersionHadolint(data?.log?.stdout);
      }
    });
  }, [vm]);
  const installDocker = (e) => {
    socket.emit("InstallDocker", token, vmId);
  };
  const installHadolint = (e) => {
    socket.emit("InstallHadolint", token, vmId);
  };
  const installTrivy = (e) => {
    socket.emit("InstallTrivy", token, vmId);
  };

  const handleRegister = () => {
    const fetch = async () => {
      const vm = await apiCaller({
        request: vmsApi.createVMS(hostVM, userVM, passVM),
      });
      if (vm) {
        alert("success full");
      }
      await apiCaller({
        request: ticketApi.UpdateTicket(vm.id, undefined),
      });
      setVmId(vm.id);
      setInfoVms(vm);
    };
    fetch();
  };
  const cards = {
    docker: {
      fn: installDocker,
      title: "Docker",
      logo: "/images/logoDocker.png",
      bg: "/images/Docker.png",
      des: "Docker là nền tảng phát triển phần mềm cho phép bạn đóng gói và chạy ứng dụng trong một môi trường cô lập gọi là container. Đảm bảo tính nhất quán giữa các môi trường phát triển và triển khai, giúp tăng tốc độ phát hành sản phẩm và giảm thiểu rủi ro.",
    },
    hadolint: {
      fn: installHadolint,
      title: "Hadolint",
      logo: "/images/logoHadolint.png",
      bg: "/images/Hadolint.png",
      des: "Hadolint là công cụ kiểm tra và phân tích Dockerfile để đảm bảo chúng tuân thủ các best practices và tiêu chuẩn an toàn. Cải thiện chất lượng code và bảo mật của Dockerfile, giúp quá trình integration và deployment diễn ra suôn sẻ hơn.",
    },
    trivy: {
      fn: installTrivy,
      title: "Trivy",
      logo: "/images/logoTrivy.png",
      bg: "/images/Trivy.png",
      des: "Trivy là công cụ quét bảo mật cho các container và các tệp tin cấu hình, giúp phát hiện các lỗ hổng bảo mật. Tích hợp trong quy trình CI/CD để tự động phát hiện và khắc phục lỗ hổng, đảm bảo an toàn cho sản phẩm trước khi triển khai.",
    },
  };
  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className=" text-3xl font-medium">VM instance</div>
        <div className=" text-xl font-medium my-6">
          Follow the instructions to connect your remote VM
        </div>
        <Form layout="vertical" form={form} onFinish={handleRegister}>
          <div className="grid gap-3 grid-cols-3">
            <Form.Item
              label="Host"
              name="host"
              rules={[{ required: true, message: "Please input your host!" }]}
              initialValue={hostVM}
            >
              <Input
                placeholder="0.0.0.0"
                className="w-40"
                onChange={(e) => {
                  setHostVM(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="User"
              name="username"
              rules={[{ required: true, message: "Please input your user!" }]}
            >
              <Input
                placeholder="user name"
                className="w-40"
                onChange={(e) => {
                  setUserVM(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Pass"
              name="password"
              rules={[{ required: true, message: "Please input your pass!" }]}
            >
              <Input
                placeholder="user name"
                className="w-40"
                onChange={(e) => {
                  setPassVM(e.target.value);
                }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            {vm ? (
              <Button htmlType="submit">Update</Button>
            ) : (
              <Button htmlType="submit">Register</Button>
            )}
          </Form.Item>
        </Form>
        <hr />
        <br />
        {infoVms && (
          <div>
            <p>
              SSH session to {infoVms.user}@{infoVms.host}
            </p>
            <p>
              Wellcome to {infoVms.operating_system} ( {infoVms.kernel}{" "}
              {infoVms.architecture} )
            </p>
            <br />
            <div className="flex">
              <p className="w-32">*Home:</p>
              <p>{infoVms.home_url}</p>
            </div>
            <div className="flex">
              <p className="w-32">*Support:</p>
              <p>{infoVms.support_url}</p>
            </div>
            <div className="flex">
              <p className="w-32">*Bug report:</p>
              <p> {infoVms.bug_report_url}</p>
            </div>
            <div className="flex">
              <p className="w-32">*Privacy policy:</p>
              <p> {infoVms.privacy_policy_url}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                {Object.keys(infoVms?.landscape_sysinfo)
                  .slice(
                    0,
                    Math.ceil(
                      Object.keys(infoVms?.landscape_sysinfo).length / 2
                    )
                  )
                  .map((key) => {
                    const value = infoVms.landscape_sysinfo[key];
                    return (
                      <div>
                        {key}: {value}
                      </div>
                    );
                  })}
              </div>
              <div>
                {Object.keys(infoVms?.landscape_sysinfo)
                  .slice(
                    Math.ceil(
                      Object.keys(infoVms?.landscape_sysinfo).length / 2
                    ),
                    Object.keys(infoVms?.landscape_sysinfo).length
                  )
                  .map((key) => {
                    const value = infoVms.landscape_sysinfo[key];
                    return (
                      <div>
                        {key}: {value}
                      </div>
                    );
                  })}
              </div>
            </div>
            <br />
            <div className="grid grid-cols-5 gap-[55px] w-full">
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>cpu(s)</p>
                <p>{infoVms.cpus}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>ram</p>
                <p>{infoVms.cpus}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>cpu(s)</p>
                <p>{infoVms.cpus}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>cpu(s)</p>
                <p>{infoVms.cpus}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>cpu(s)</p>
                <p>{infoVms.cpus}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal footer={false} closeIcon={false} open={isOpen}>
        <Carousel
          autoplay
          className="carousel"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {infoVms &&
            Object.keys(infoVms?.set_up).map((key) => {
              const version = infoVms?.set_up[key];
              return (
                <Card
                  title={
                    <div className="flex gap-5">
                      <img className="w-7" alt="#" src={cards[key]?.logo} />
                      <p>{cards[key].title}</p>
                    </div>
                  }
                  style={{ width: 240 }}
                  cover={
                    <img
                      className="h-[250px] object-cover"
                      alt="docker.png"
                      src={cards[key]?.bg}
                    />
                  }
                >
                  <div className="h-36">
                    <div className="text-justify">{cards[key]?.des}</div>
                    <div className="text-center mt-3">
                      {version === "" ? (
                        <Button onClick={cards[key]?.fn}>Install</Button>
                      ) : (
                        version
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
        </Carousel>
        <Button className="mt-3" onClick={checkInstall}>
          Cancel
        </Button>
      </Modal>
    </>
  );
}
