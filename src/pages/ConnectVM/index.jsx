import React, { useEffect, useState } from "react";
import socket from "../../utils/socket/socket";
import useEffectOnce from "../../hook/useEffectOnce";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  Modal,
  Carousel,
  Card,
  message,
  Select,
  Progress,
  Flex,
} from "antd";
import vmsApi from "../../apis/vms.api";
import "./style.css";
import apiCaller from "../../apis/apiCaller";
import ticketApi from "../../apis/ticket.api";
import { useSelector } from "react-redux";

export default function ConnectVM() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const [form] = Form.useForm();

  const [logInstallHadolint, setLogInstallHadolint] = useState([]);
  const [logInstallTrivy, setLogInstallTrivy] = useState([]);
  const [logInstallDocker, setLogInstallDocker] = useState([]);

  const [hostVM, setHostVM] = useState();
  const [userVM, setUserVM] = useState();
  const [passVM, setPassVM] = useState();
  const [standardVM, setStandardVM] = useState();
  const [standardCompoareVM, setStandardCompoareVM] = useState();
  const [vmId, setVmId] = useState();

  const [versionDocker, setVersionDocker] = useState();
  const [versionHadolint, setVersionHadolint] = useState();
  const [versionTrivy, setVersionTrivy] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [infoVms, setInfoVms] = useState();
  const token = localStorage.getItem("accessToken");
  const [fields, setFields] = useState();
  const [standards, SetStandards] = useState([]);
  const standard_ids = useSelector((state) => state.user.ticket.standard_ids);
  const conicColors = {
    "0%": "red",
    "50%": "yellow", // Corrected spelling
    "100%": "green", // Corrected spelling
  };
  const [stepsCount, setStepsCount] = React.useState(5);
  const [stepsGap, setStepsGap] = React.useState(7);
  useEffect(() => {
    setVersionDocker(infoVms?.set_up?.docker);
    setVersionHadolint(infoVms?.set_up?.hadolint);
    setVersionTrivy(infoVms?.set_up?.trivy);
    if (infoVms !== undefined && infoVms.status === "CONNECTED") {
      setIsOpen(true);
    }
  }, [infoVms]);

  useEffect(() => {
    setVersionDocker(infoVms?.set_up?.docker);
    setVersionHadolint(infoVms?.set_up?.hadolint);
    setVersionTrivy(infoVms?.set_up?.trivy);
    if (infoVms !== undefined && infoVms.status === "CONNECTED") {
      setIsOpen(true);
    }
  }, [infoVms]);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getStandards(standard_ids),
      });
      SetStandards(res);
    };
    fetch();
  }, [standard_ids]);

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
  useEffect(() => {
    setVmId(vm);
    if (vm) {
      const fetch = async () => {
        const res = await apiCaller({
          request: vmsApi.getVmsById(vm),
        });
        setInfoVms(res);
        setUserVM(res.user);
        setPassVM(res.pass);
        setFields([
          {
            name: ["host"],
            value: res.host,
          },
          {
            name: ["username"],
            value: res.user,
          },
          {
            name: ["password"],
            value: res.pass,
          },
        ]);
        const compare = await apiCaller({
          request: vmsApi.compareStandard(res.standard, res.id),
        });
        if (compare?.code) {
          message.error(compare.errors[0].message);
        } else {
          setStandardVM(res.standard);
          setStandardCompoareVM(compare);
        }
      };
      setVmId(vm);

      fetch();
    }
    setReload(false);
  }, [vm, reload]);
  const installDocker = async (e) => {
    const res = await apiCaller({
      request: vmsApi.installDocker(vm),
    });
    if (res?.code) {
      message.error(res.errors[0].message);
    } else {
      message.info(res?.message);
    }
    setReload(true);
  };
  const installHadolint = async (e) => {
    const res = await apiCaller({
      request: vmsApi.installHadolint(vm),
    });
    if (res?.code) {
      message.error(res.errors[0].message);
    } else {
      message.info(res?.message);
    }
    setReload(true);
  };
  const installTrivy = async (e) => {
    const res = await apiCaller({
      request: vmsApi.installTrivy(vm),
    });
    if (res?.code) {
      message.error(res.errors[0].message);
    } else {
      message.info(res?.message);
    }
    setReload(true);
  };

  const handleRegister = () => {
    const fetchC = async () => {
      const vmT = await apiCaller({
        request: vmsApi.createVMS(hostVM, userVM, passVM, standardVM),
      });
      if (vmT?.code) {
        message.error(`${vmT?.errors[0].message} ${vmT.errors[0].value}`);
      } else {
        await apiCaller({
          request: ticketApi.UpdateTicket(vmT.id, undefined),
        });
        if (vmT.status === "DISCONNECTED") {
          message.warning("DISCONNECTED. You check connect or infor user");
          await apiCaller({
            request: ticketApi.getTicketDetail(),
          });
          navigate("/dashboard");
        } else {
          setVmId(vmT.id);
          setInfoVms(vmT);
        }
      }
    };
    const fetchU = async () => {
      const vmU = await apiCaller({
        request: vmsApi.updateVms(vm, userVM, passVM),
      });
      if (vmU.status === "DISCONNECTED") {
        message.warning("DISCONNECTED. You check connect or infor user");
        await apiCaller({
          request: ticketApi.getTicketDetail(),
        });
        navigate("/dashboard");
      } else {
        setVmId(vmU.id);
        setInfoVms(vmU);
      }
    };
    vm ? fetchU() : fetchC();
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
        <Form
          layout="vertical"
          form={form}
          onFinish={handleRegister}
          fields={fields}
        >
          <div className="grid gap-3 grid-cols-3">
            <Form.Item
              label="Host"
              name="host"
              rules={[
                { required: true, message: "Please input your host!" },
                {
                  validator: (rule, value) => {
                    if (
                      !value ||
                      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        value
                      )
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Invalid IP address");
                  },
                },
              ]}
            >
              <Input
                placeholder="0.0.0.0"
                className="w-40"
                // defaultValue={hostVM}
                disabled={fields ? true : false}
                // value={hostVM}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setHostVM(newValue);
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
                type="password"
              />
            </Form.Item>
          </div>
          <div>
            <div>
              <div className="flex items-center gap-2">
                <Form.Item
                  name={"standard"}
                  label={"Standard"}
                  rules={[
                    { required: true, message: "Please input your standard!" },
                  ]}
                >
                  <Select
                    style={{ width: 200 }}
                    onChange={async (value) => {
                      const res = await apiCaller({
                        request: vmsApi.compareStandardBeforeCreate(
                          value,
                          hostVM,
                          userVM,
                          passVM
                        ),
                      });
                      if (res?.code) {
                        message.error(res.errors[0].message);
                      } else {
                        setStandardVM(value);
                        setStandardCompoareVM(res);
                      }
                    }}
                    options={standards.map((s, index) => {
                      return {
                        value: s.id,
                        label: <>{s.name}</>,
                        key: index,
                      };
                    })}
                  />
                </Form.Item>
                {standardCompoareVM && (
                  <Flex gap="small" wrap>
                    <Progress
                      type="circle"
                      size={"small"}
                      percent={Number.parseInt(
                        Number.parseFloat(standardCompoareVM?.rate_total) * 100
                      )}
                      strokeColor={conicColors}
                      format={(percent) => {
                        return `${
                          standardCompoareVM?.rate_total &&
                          Number.parseFloat(standardCompoareVM?.rate_total) < 1
                            ? "Not suitable"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_total
                              ) >= 1
                            ? "suitable"
                            : "Very suitable"
                        }`;
                      }}
                    />
                  </Flex>
                )}
              </div>
              <div className="flex w-40">
                {standardCompoareVM && (
                  <Flex gap="small" className="w-full" vertical>
                    <div>
                      <div
                        className={`${
                          standardCompoareVM?.rate_ram &&
                          Number.parseFloat(standardCompoareVM?.rate_ram) < 1
                            ? "text-red-500"
                            : Number.parseFloat(standardCompoareVM?.rate_ram) >=
                              1
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        Ram{" "}
                        {`${
                          standardCompoareVM?.rate_ram &&
                          Number.parseFloat(standardCompoareVM?.rate_ram) < 1
                            ? "not suitable"
                            : Number.parseFloat(standardCompoareVM?.rate_ram) >=
                              1
                            ? "suitable"
                            : "very suitable"
                        }`}
                      </div>
                      <Progress
                        percent={
                          Number.parseFloat(standardCompoareVM?.rate_ram) * 100
                        }
                        strokeColor={conicColors}
                        status={`${
                          standardCompoareVM?.rate_ram &&
                          Number.parseFloat(standardCompoareVM?.rate_ram) < 1
                            ? "exception"
                            : Number.parseFloat(standardCompoareVM?.rate_ram) >=
                              1
                            ? "active"
                            : "success"
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`${
                          standardCompoareVM?.rate_cpu &&
                          Number.parseFloat(standardCompoareVM?.rate_cpu) < 1
                            ? "text-red-500"
                            : Number.parseFloat(standardCompoareVM?.rate_cpu) >=
                              1
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        Cpu{" "}
                        {`${
                          standardCompoareVM?.rate_cpu &&
                          Number.parseFloat(standardCompoareVM?.rate_cpu) < 1
                            ? "not suitable"
                            : Number.parseFloat(standardCompoareVM?.rate_cpu) >=
                              1
                            ? "suitable"
                            : "very suitable"
                        }`}
                      </div>
                      <Progress
                        percent={
                          Number.parseFloat(standardCompoareVM?.rate_cpu) * 100
                        }
                        status={`${
                          standardCompoareVM?.rate_cpu &&
                          Number.parseFloat(standardCompoareVM?.rate_cpu) < 1
                            ? "exception"
                            : Number.parseFloat(standardCompoareVM?.rate_cpu) >=
                              1
                            ? "active"
                            : "success"
                        }`}
                        strokeColor={conicColors}
                      />
                    </div>
                    <div>
                      <div
                        className={`${
                          standardCompoareVM?.rate_core &&
                          Number.parseFloat(standardCompoareVM?.rate_core) < 1
                            ? "text-red-500"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_core
                              ) >= 1
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        Core{" "}
                        {`${
                          standardCompoareVM?.rate_core &&
                          Number.parseFloat(standardCompoareVM?.rate_core) < 1
                            ? "not suitable"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_core
                              ) >= 1
                            ? "suitable"
                            : "very suitable"
                        }`}
                      </div>
                      <Progress
                        percent={
                          Number.parseFloat(standardCompoareVM?.rate_core) * 100
                        }
                        status={`${
                          standardCompoareVM?.rate_core &&
                          Number.parseFloat(standardCompoareVM?.rate_core) < 1
                            ? "exception"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_core
                              ) >= 1
                            ? "active"
                            : "success"
                        }`}
                        strokeColor={conicColors}
                      />
                    </div>
                    <div>
                      <div
                        className={`${
                          standardCompoareVM?.rate_os &&
                          Number.parseFloat(standardCompoareVM?.rate_os) < 1
                            ? "text-red-500"
                            : Number.parseFloat(standardCompoareVM?.rate_os) >=
                              1
                            ? "text-green-500"
                            : "text-green-500"
                        }`}
                      >
                        Os{" "}
                        {`${
                          standardCompoareVM?.rate_os &&
                          Number.parseFloat(standardCompoareVM?.rate_os) < 1
                            ? "not suitable"
                            : Number.parseFloat(standardCompoareVM?.rate_os) >=
                              1
                            ? "suitable"
                            : "very suitable"
                        }`}
                      </div>
                      <Progress
                        percent={
                          Number.parseFloat(standardCompoareVM?.rate_os) * 100
                        }
                        strokeColor={conicColors}
                        status={`${
                          standardCompoareVM?.rate_os &&
                          Number.parseFloat(standardCompoareVM?.rate_os) < 1
                            ? "exception"
                            : Number.parseFloat(standardCompoareVM?.rate_os) >=
                              1
                            ? "success"
                            : "success"
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`${
                          standardCompoareVM?.rate_architecture &&
                          Number.parseFloat(
                            standardCompoareVM?.rate_architecture
                          ) < 1
                            ? "text-red-500"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_architecture
                              ) >= 1
                            ? "text-green-500"
                            : "text-green-500"
                        }`}
                      >
                        Architecture{" "}
                        {`${
                          standardCompoareVM?.rate_architecture &&
                          Number.parseFloat(
                            standardCompoareVM?.rate_architecture
                          ) < 1
                            ? "not suitable"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_architecture
                              ) >= 1
                            ? "suitable"
                            : "very suitable"
                        }`}
                      </div>
                      <Progress
                        percent={
                          Number.parseFloat(
                            standardCompoareVM?.rate_architecture
                          ) * 100
                        }
                        strokeColor={conicColors}
                        status={`${
                          standardCompoareVM?.rate_architecture &&
                          Number.parseFloat(
                            standardCompoareVM?.rate_architecture
                          ) < 1
                            ? "exception"
                            : Number.parseFloat(
                                standardCompoareVM?.rate_architecture
                              ) >= 1
                            ? "success"
                            : "success"
                        }`}
                      />
                    </div>
                  </Flex>
                )}
              </div>
            </div>
          </div>
          <Form.Item>
            {vm ? (
              <Button htmlType="submit">Update</Button>
            ) : (
              <Button htmlType="submit" disabled={!standardVM ? true : false}>
                Register
              </Button>
            )}
          </Form.Item>
        </Form>
        <hr />
        <br />
        {infoVms && infoVms.status === "CONNECTED" && (
          <div>
            <p className="flex">
              <p>SSH session to &nbsp;</p>
              <p className="text-purple-400">
                {infoVms.user}@{infoVms.host}
              </p>
            </p>
            <p>
              Wellcome to {infoVms.operating_system} ( {infoVms.kernel}{" "}
              {infoVms.architecture} )
            </p>
            <br />
            <div className="flex">
              <p className="w-32 ">*Home:</p>
              <a
                href={`${infoVms.home_url}`}
                className="underline first-letter:underline-offset-1"
              >
                {infoVms.home_url}
              </a>
            </div>
            <div className="flex">
              <p className="w-32 ">*Support:</p>
              <a
                href={`${infoVms.support_url}`}
                className="underline first-letter:underline-offset-1"
              >
                {infoVms.support_url}
              </a>
            </div>
            <div className="flex">
              <p className="w-32 ">*Bug report:</p>
              <a
                href={`${infoVms.bug_report_url}`}
                className="underline first-letter:underline-offset-1"
              >
                {infoVms.bug_report_url}
              </a>
            </div>
            <div className="flex">
              <p className="w-32 ">*Privacy policy:</p>
              <a
                href={`${infoVms.privacy_policy_url}`}
                className="underline first-letter:underline-offset-1"
              >
                {infoVms.privacy_policy_url}
              </a>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <div>
                {Object.keys(infoVms?.landscape_sysinfo)
                  .filter((key, idx) => idx % 2 === 0)
                  .map((key, idx) => {
                    const value = infoVms.landscape_sysinfo[key];
                    const color =
                      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        value
                      )
                        ? "text-purple-400"
                        : "";
                    return (
                      <div className="flex" key={idx}>
                        <p>{`${key}:`} &nbsp;</p>{" "}
                        <p className={`${color}`}> {value}</p>
                      </div>
                    );
                  })}
              </div>
              <div>
                {Object.keys(infoVms?.landscape_sysinfo)
                  .filter((key, idx) => idx % 2 !== 0)
                  .map((key, idx) => {
                    const value = infoVms.landscape_sysinfo[key];
                    const color =
                      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        value
                      )
                        ? "text-purple-400"
                        : "";
                    return (
                      <div className="flex" key={idx}>
                        <p>{`${key}:`} &nbsp;</p>{" "}
                        <p className={`${color}`}> {value}</p>
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
                <p>{infoVms.ram}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>core(s)</p>
                <p>{infoVms.cores}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>socket(s)</p>
                <p>{infoVms.sockets}</p>
              </div>
              <div className=" flex items-center justify-between p-4 h-6 border border-solid border-[#f0d0f0] rounded-md">
                <p>thread(s)</p>
                <p>{infoVms.thread}</p>
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
            infoVms.status === "CONNECTED" &&
            Object.keys(infoVms?.set_up).map((key, index) => {
              const version = infoVms?.set_up[key];
              return (
                <Card
                  className="w-[472px]"
                  key={index}
                  title={
                    <div className="flex gap-5">
                      <img className="w-7" alt="#" src={cards[key]?.logo} />
                      <p>{cards[key].title}</p>
                    </div>
                  }
                  style={{ width: 240 }}
                  cover={
                    <div className="w-[472px]">
                      <img
                        className="h-[250px] w-full object-cover"
                        alt="docker.png"
                        src={cards[key]?.bg}
                      />
                    </div>
                  }
                >
                  <div className="h-36">
                    <div className="text-justify">{cards[key]?.des}</div>
                    <div className="text-center mt-3">
                      {version === "" ? (
                        <Button onClick={cards[key]?.fn}>Install</Button>
                      ) : (
                        <div onClick={cards[key]?.fn}>{version}</div>
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
