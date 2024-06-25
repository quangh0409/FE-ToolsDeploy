import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuCustom, { getItem } from "../MenuCustom";
import {
  FileDoneOutlined,
  FileImageOutlined,
  FunctionOutlined,
  GithubOutlined,
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import TemplateDetailPage from "../Scan";
import { Button, Form, Input, Modal, Radio, message } from "antd";
import apiCaller from "../../apis/apiCaller";
import authApi from "../../apis/auth.api";
import scanApi from "../../apis/scan.api";
import Standard from "../Standard";
import { store } from "../../redux/store";
import {
  setEnvironments,
  setTourConnectVM,
  setTourDashboard,
  setTourHeader,
  setTourPipeline,
  setTourStepYourGit,
  setTourYourGit,
} from "../../redux/reducer/user";

import "./style.css";
import ResultTrivy from "../ResultTrivy";
import { Tour } from "antd";
import useEffectOnce from "../../hook/useEffectOnce";

export default function Header() {
  const uri = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fullname = useSelector((state) => state.user.fullname);
  const avatar = useSelector((state) => state.user?.avatar);
  const tourHeader = useSelector((state) => state.user?.tour?.header);
  const tourPipeline = useSelector((state) => state.user?.tour?.pipeline);
  const tourYourGit = useSelector((state) => state.user?.tour?.yourGit);
  const vm = params.get("vm");
  const path = uri.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalScanSyntaxOpen, setIsModaScanSyntaxOpen] = useState(false);
  const [isModalImagesOpen, setIsModaImagesOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [contentfile, setContentfile] = useState();
  const [resultScanSyntax, setResultScanSyntax] = useState();
  const [resultScan, setResultScan] = useState();
  const [errorLine, setErrorLine] = useState();
  const [openTour, setOpenTour] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("accessToken") !== "undefined" &&
      path === "/dashboard-home"
    ) {
      // setOpenTour(true);
    }
  }, [path]);

  const refCaseOne1 = useRef(null);
  const refCaseOne2 = useRef(null);
  const refCaseOne3 = useRef(null);
  const refCaseOne4 = useRef(null);
  const refCaseOne5 = useRef(null);

  const refCaseSecond1 = useRef(null);
  const refCaseSecond2 = useRef(null);
  const refCaseSecond3 = useRef(null);

  const ref3 = useRef(null);
  const stepsCaseOne = [
    {
      title: "Create your standard",
      description: (
        <>
          <div>
            Set standards for your VM-instance, to ensure the quality of the
            cloud platform matches the code you want to deploy
          </div>
          <div>
            <div>
              <img src="/images/tourStandard.png" />
            </div>
          </div>
        </>
      ),
      target: () => refCaseOne1.current,
    },
    {
      title: "New connect to your VM-instance",
      description: (
        <>
          <div>
            Add a cloud platform so the software can be remote and deploy and
            deploy the CI/CD pipeline
          </div>
          <div>
            <div>
              <img src="/images/tourNewVM.png" />
            </div>
          </div>
        </>
      ),

      target: () => refCaseOne2.current,
    },
    {
      title: "Scan Dockerfile",
      description: (
        <>
          <div>
            This function will check the dockerfile syntax and give error
            descriptions if any
          </div>
          <div>
            <div>
              <img src="/images/tourScanDockerfile.png" />
            </div>
          </div>
        </>
      ),

      target: () => refCaseOne3.current,
    },
    {
      title: "Scan Image",
      description: (
        <>
          <div>This function will check library security in images</div>
          <div>
            <div>
              <img src="/images/tourScanImage.png" />
            </div>
          </div>
        </>
      ),

      target: () => refCaseOne4.current,
    },
    {
      title: "Your Github",
      description: (
        <>
          <div>
            This function displays a list of repositories, where you can select
            resources to deploy and CI/CD pipeline
          </div>
          <p>
            Please configure in the direction below so that the software can
            receive and write code changes from your Github:
          </p>
          <p>
            Step 1: Access Github, Choose repository which you want to deploy
            and CI/CD pipeline, below choose setting/webhook
          </p>
          <p>Step 2: Configure as shown below on the right</p>
          <p>Note:(End point) https://smee.io/NEsyf7sKQOTJ8tOk/</p>
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <img className="w-full h-80" src="/images/tourGit.png" />
            </div>
            <div className="col-span-2 ">
              <img
                className="w-full h-80"
                src="/images/exConfigWebhook.png"
                alt="#"
              />
            </div>
          </div>
        </>
      ),

      target: () => refCaseOne5.current,
    },
  ];

  const stepsCaseSecond = [
    {
      title: "Create your standard",
      description: (
        <>
          <div>
            Set standards for your VM-instance, to ensure the quality of the
            cloud platform matches the code you want to deploy
          </div>
          <div>
            <div>
              <img src="/images/tourStandard.png" />
            </div>
          </div>
        </>
      ),
      target: () => refCaseSecond1.current,
    },
    {
      title: "New connect to your VM-instance",
      description: (
        <>
          <div>
            Add a cloud platform so the software can be remote and deploy and
            deploy the CI/CD pipeline
          </div>
          <div>
            <div>
              <img src="/images/tourNewVM.png" />
            </div>
          </div>
        </>
      ),

      target: () => refCaseSecond2.current,
    },
  ];

  const stepsCaseSecondStep3 = [
    {
      title: "Your Github",
      description: (
        <>
          <div>
            This function displays a list of repositories, where you can select
            resources to deploy and CI/CD pipeline
          </div>
          <p>
            Please configure in the direction below so that the software can
            receive and write code changes from your Github:
          </p>
          <p>
            Step 1: Access Github, Choose repository which you want to deploy
            and CI/CD pipeline, below choose setting/webhook
          </p>
          <p>Step 2: Configure as shown below on the right</p>
          <p>Note:(End point) https://smee.io/NEsyf7sKQOTJ8tOk/</p>
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <img className="w-full h-80" src="/images/tourGit.png" />
            </div>
            <div className="col-span-2">
              <img
                className="w-full h-80"
                src="/images/exConfigWebhook.png"
                alt="#"
              />
            </div>
          </div>
        </>
      ),
      target: () => refCaseSecond3.current,
    },
  ];

  const stepsOne = [
    {
      title: "Welcome to ToolsDeploy",
      description: (
        <>
          <div>
            This is a tool to help you deploy and integrate CI/CD for your
            resource
          </div>
          <div>Do you want to continue with the instructions for use?</div>
          <div className="flex justify-between">
            <Button
              onClick={() => {
                setOpenTour(false);
                store.dispatch(setTourHeader(true));
              }}
            >
              Each function one by one
            </Button>
            <Button
              onClick={() => {
                setOpenTour(false);
                store.dispatch(setTourPipeline(true));
              }}
            >
              Deploy & pipeline CI/CD
            </Button>
          </div>
        </>
      ),
      // prevButtonProps: { children: <Button>ok</Button> },
      // cover: <Button>ok</Button>,
      target: () => ref3.current,
    },
  ];

  const handle1 = (e) => {
    if (e.key === "logout") {
      localStorage.clear();

      navigate("/");
    }
    if (e.key === "setting") {
      setIsModalOpen(true);
    }
    if (e.key === "git") {
      store.dispatch(setTourHeader(false));
      store.dispatch(setTourYourGit(false));
      store.dispatch(setTourStepYourGit(true));
      vm ? navigate(`/connectGithub?vm=${vm}`) : navigate(`/connectGithub`);
    }
    if (e.key === "standard") {
      store.dispatch(setTourHeader(false));
      setIsOpen(true);
    }
    if (e.key === "dockerfile") {
      store.dispatch(setTourHeader(false));
      setIsModaScanSyntaxOpen(true);
    }
    if (e.key === "image") {
      store.dispatch(setTourHeader(false));
      setIsModaImagesOpen(true);
    }
    if (e.key === "repos") {
      navigate("/dashboardv2");
    }
    if (e.key === "vm-instance") {
      navigate("/dashboard-vm");
    }
  };

  const handle2 = (e) => {
    if (e.key === "vm-instance") {
      navigate("/dashboard/VM-connect");
      store.dispatch(setTourPipeline(false));
      store.dispatch(setTourConnectVM(true));
    } else if(e.key === "webapp") {
      navigate(`/connectGithub?vm=${vm}`);
      store.dispatch(
        setEnvironments([
          [
            {
              name: "",
              vm: "",
              branch: "",
              docker_file: [],
              docker_compose: [],
              postman: {
                collection: {},
                environment: {},
              },
            },
          ],
        ])
      );
    }
  };

  const nodeLeft = () => {
    if (uri.pathname === "/") {
      return (
        <img className="col-span-2" src="/images/logo-bg-w.png" alt="logo" />
      );
    } else if (uri.pathname === "/home") {
      return (
        <>
          <img className="col-span-2" src="/images/logo-bg-w.png" alt="logo" />;
          <div className="col-span-1 text-2xl ml-3 text-center">Docs</div>
          <div className="col-span-1 text-2xl ml-3 text-center">About</div>
        </>
      );
    }
    return (
      <>
        <img className="col-span-2" src="/images/logo-bg-w.png" alt="logo" />
        <div className="col-span-2 grid grid-cols-6">
          <div
            ref={ref3}
            className="col-span-4 text-2xl ml-3 text-center border-black border-solid border-r"
            onClick={() => {
              navigate("/dashboard-home");
            }}
          >
            Dashboard
          </div>
          <div className="col-span-2 text-2xl text-left ">Docs</div>
        </div>
      </>
    );
  };

  const items = [
    getItem(
      `${fullname}`,
      "sub4",
      avatar ? (
        <img className="w-8 rounded-full" src={avatar} />
      ) : (
        <UserOutlined />
      ),
      [
        getItem(`${fullname}`, "9", <UserOutlined />),
        getItem("Change Password", "setting", <SettingOutlined />),
        getItem("Scan Dockerfile", "dockerfile", <FunctionOutlined />),
        getItem("Scan Image", "image", <FileImageOutlined />),
        getItem("New Standard", "standard", <FileDoneOutlined />),
        getItem("Your Github", "git", <GithubOutlined />),
        getItem("Manager Repository", "repos", <GithubOutlined />),
        getItem("Manager VM-instance", "vm-instance", <GlobalOutlined />),
        getItem("Logout", "logout", <LogoutOutlined />),
      ]
    ),
  ];

  const NewItems = [
    getItem("New", "sub1", <PlusOutlined />, [
      // getItem("Add Webapp", "webapp", <GlobalOutlined />),
      getItem("Add VM instance", "vm-instance", <GlobalOutlined />),
    ]),
  ];

  return (
    <>
      {/* <Divider /> */}
      <div className="flex h-20 justify-between">
        <div className="grid grid-cols-4 w-96 items-center justify-center ml-3">
          {nodeLeft()}
        </div>

        <div className=" grid grid-cols-6 w-72 mr-3 text-center items-center justify-center">
          {uri.pathname === "/" ? (
            <>
              <div className="col-span-4"></div>
              <div
                onClick={() => {
                  navigate("/dashboard-home");
                }}
              >
                Dashboard
              </div>
            </>
          ) : (
            <>
              <div
                className="col-span-2 border-black border-solid border rounded-lg "
                ref={refCaseOne2}
              >
                <div ref={refCaseSecond2}>
                  <MenuCustom
                    items={NewItems}
                    width={90}
                    className={"rounded-lg"}
                    onClick={handle2}
                  />
                </div>
              </div>

              <div
                className="col-span-4 flex  justify-center items-center"
                ref={refCaseOne1}
              >
                <div ref={refCaseOne3}>
                  <div ref={refCaseOne4}>
                    <div ref={refCaseOne5}>
                      <div ref={refCaseSecond1}>
                        <div ref={refCaseSecond3}>
                          <MenuCustom
                            items={items}
                            width={"w-48"}
                            className={"avatar_cs"}
                            onClick={handle1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Tour
        open={tourHeader}
        mask={false}
        type="primary"
        onClose={() => {
          store.dispatch(setTourHeader(false));
        }}
        onFinish={() => {
          store.dispatch(setTourHeader(false));
        }}
        steps={stepsCaseOne}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
      <Tour
        open={tourPipeline}
        mask={false}
        type="primary"
        onClose={() => {
          store.dispatch(setTourPipeline(false));
        }}
        onFinish={() => {
          store.dispatch(setTourPipeline(false));
          // store.dispatch(setTourDashboard(true));
        }}
        steps={stepsCaseSecond}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
      <Tour
        open={tourYourGit}
        mask={false}
        type="primary"
        onClose={() => {
          store.dispatch(setTourYourGit(false));
        }}
        onFinish={() => {
          store.dispatch(setTourYourGit(false));
        }}
        steps={stepsCaseSecondStep3}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
      <Tour
        open={openTour}
        mask={false}
        type="primary"
        onClose={() => setOpenTour(false)}
        onFinish={() => {}}
        steps={stepsOne}
      />
      <Modal
        open={isModalOpen}
        footer={false}
        onCancel={() => setIsModalOpen(false)}
        closeIcon={true}
        width={700}
        height={300}
      >
        <div className="text-center">
          <p className="m-6">
            Please enter the email you registered with Github
          </p>
          <Form
            form={form}
            onFinish={async () => {
              const res = await apiCaller({
                request: authApi["update-password"](oldPassword, newPassword),
              });
              if (!res?.code) {
                message.info("You have successfully changed your password");
              } else {
                message.error(res.errors[0].message);
              }
            }}
          >
            <Form.Item
              name="old-pass"
              label="Old password"
              rules={[
                { required: true, message: "Please input your old password!" },
              ]}
            >
              <Input.Password
                className="w-96"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
            <Form.Item
              name="new-pass"
              label="New password"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                className="w-96"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="text-right">
          <Radio.Button
            className="ml-6 "
            value="default"
            onClick={() => {
              form.submit();
            }}
          >
            OK
          </Radio.Button>
        </div>
      </Modal>
      <Modal
        open={isOpen}
        footer={false}
        onCancel={() => setIsOpen(false)}
        closeIcon={true}
        width={1500}
        zIndex={10000}
      >
        <Standard />
      </Modal>
      <Modal
        open={isModalScanSyntaxOpen}
        footer={false}
        onCancel={() => setIsModaScanSyntaxOpen(false)}
        closeIcon={false}
        width={1500}
      >
        <TemplateDetailPage
          contentfile={contentfile}
          setContentfile={setContentfile}
          resultScanSyntax={resultScanSyntax}
          errorLine={errorLine}
        />
        <div className="flex justify-between mt-5">
          <div className="flex ">
            <Button
              className="mr-3"
              onClick={async () => {
                const res = await apiCaller({
                  request: scanApi.scanSyxtax(contentfile.content),
                });
                const lines = res.map((val) => {
                  if (val.level === "error") return val.line;
                });
                setErrorLine(lines);
                setResultScanSyntax(res);
              }}
            >
              Scan
            </Button>
            <Button
              onClick={() => {
                if (!contentfile?.name || contentfile?.name === "") {
                  alert("Please enter name file");
                }
                setIsModaScanSyntaxOpen(false);
              }}
            >
              Save
            </Button>
          </div>
          <Button
            onClick={() => {
              setIsModaScanSyntaxOpen(false);
              setContentfile({
                name: "",
                content: "",
                type: "",
              });
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        open={isModalImagesOpen}
        footer={false}
        onCancel={() => setIsModaImagesOpen(false)}
        closeIcon={true}
        width={1200}
      >
        <div className="m-6">
          <Form
            form={form}
            onFinish={async (e) => {
              const res = await apiCaller({
                request: scanApi.scanImage(e.name_image),
              });
              if (!res?.code) {
                setResultScan(res?.Results);
                message.info("Scan successfully");
              } else {
                message.error(res.errors[0].message || res.description);
              }
            }}
            className="flex justify-between"
          >
            <Form.Item
              name="name_image"
              rules={[
                { required: true, message: "Please input your image!" },
                {
                  validator: (rule, value) => {
                    if (
                      !value ||
                      /^docker\.io\/[a-z0-9-_]+\/[a-z0-9-_]+$/.test(value)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Invalid docker Image Names");
                  },
                },
              ]}
            >
              <Input
                placeholder="docker.io/repository/name_image"
                className="w-[900px]"
              ></Input>
            </Form.Item>
            <Button htmlType="submit">Scan</Button>
          </Form>
        </div>
        {resultScan && <ResultTrivy Results={resultScan} y={500} />}
      </Modal>
    </>
  );
}
