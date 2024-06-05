import React, { useState } from "react";
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
import { Avatar, Button, Form, Input, Modal, Radio, message } from "antd";
import apiCaller from "../../apis/apiCaller";
import authApi from "../../apis/auth.api";
import scanApi from "../../apis/scan.api";
import Standard from "../Standard";
import { store } from "../../redux/store";
import { setEnvironments } from "../../redux/reducer/user";

import "./style.css";
import ResultTrivy from "../ResultTrivy";

export default function Header() {
  const uri = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fullname = useSelector((state) => state.user.fullname);
  const avatar = useSelector((state) => state.user.avatar);
  const vm = params.get("vm");
  const path = uri.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalScanSyntaxOpen, setIsModaScanSyntaxOpen] = useState(false);
  const [isModalImagesOpen, setIsModaImagesOpen] = useState(false);
  const [form] = Form.useForm();
  const [formv1] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [contentfile, setContentfile] = useState();
  const [resultScanSyntax, setResultScanSyntax] = useState();
  const [resultScan, setResultScan] = useState();
  const [errorLine, setErrorLine] = useState();
  const handle1 = (e) => {
    if (e.key === "logout") {
      localStorage.clear();
      navigate("/");
    }
    if (e.key === "setting") {
      setIsModalOpen(true);
    }
    if (e.key === "git") {
      vm ? navigate(`/connectGithub?vm=${vm}`) : navigate(`/connectGithub`);
    }
    if (e.key === "standard") {
      setIsOpen(true);
    }
    if (e.key === "dockerfile") {
      setIsModaScanSyntaxOpen(true);
    }
    if (e.key === "image") {
      setIsModaImagesOpen(true);
    }
  };

  const handle2 = (e) => {
    if (path === "/dashboard") {
      navigate("/dashboard/VM-connect");
    } else {
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
            className="col-span-4 text-2xl ml-3 text-center border-black border-solid border-r"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </div>
          <div className="col-span-2 text-2xl text-left ">Docs</div>
        </div>
      </>
    );
  };

  const nodeRight = () => {
    if (uri.pathname === "/") {
      return (
        <>
          <div className="col-span-4"></div>
          <div
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </div>
        </>
      );
    }
    return (
      <>
        <div className="col-span-2 border-black border-solid border rounded-lg ">
          <MenuCustom
            items={NewItems}
            width={90}
            className={"rounded-lg"}
            onClick={handle2}
          />
        </div>
        <div className="col-span-4 flex  justify-center items-center">
          <MenuCustom
            items={items}
            width={"w-48"}
            className={"avatar_cs"}
            onClick={handle1}
          />
        </div>
      </>
    );
  };

  const items = [
    getItem(
      `${fullname}`,
      "sub4",
      <img className="w-8 rounded-full" src={avatar} />,
      [
        getItem(`${fullname}`, "9", <UserOutlined />),
        getItem("Change Password", "setting", <SettingOutlined />),
        getItem("Scan Dockerfile", "dockerfile", <FunctionOutlined />),
        getItem("Scan Image", "image", <FileImageOutlined />),
        getItem("New Standard", "standard", <FileDoneOutlined />),
        getItem("Your Github", "git", <GithubOutlined />),
        getItem("Logout", "logout", <LogoutOutlined />),
      ]
    ),
  ];

  const NewItems =
    path === "/dashboard"
      ? [
          getItem("New", "sub1", <PlusOutlined />, [
            getItem("Add VM instance", "Webapp", <GlobalOutlined />),
          ]),
        ]
      : [
          getItem("New", "sub1", <PlusOutlined />, [
            getItem("Add Webapp", "Webapp", <GlobalOutlined />),
          ]),
        ];

  return (
    <>
      <div className="flex h-20 justify-between">
        <div className="grid grid-cols-4 w-96 items-center justify-center ml-3">
          {nodeLeft()}
        </div>

        <div className=" grid grid-cols-6 w-72 mr-3 text-center items-center justify-center">
          {nodeRight()}
        </div>
      </div>
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
              console.log(res);
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
              console.log("🚀 ~ onFinish={ ~ e:", e);
              const res = await apiCaller({
                request: scanApi.scanImage(e.name_image),
              });
              console.log(res);
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
