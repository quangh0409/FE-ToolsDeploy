import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuCustom, { getItem } from "../MenuCustom";
import {
  GithubOutlined,
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import useEffectOnce from "../../hook/useEffectOnce";
import { Form, Input, Modal, Radio, message } from "antd";
import apiCaller from "../../apis/apiCaller";
import authApi from "../../apis/auth.api";
import Standard from "../Standard";
import { store } from "../../redux/store";
import { setEnvironments } from "../../redux/reducer/user";

export default function Header() {
  const uri = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fullname = useSelector((state) => state.user.fullname);
  const vm = params.get("vm");
  const path = uri.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const nodeRight = () => {
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

  const nodeLeft = () => {
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
            onClick={() => {
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
            }}
          />
        </div>
        <div className="col-span-4 flex  justify-center">
          <MenuCustom
            items={items}
            width={"w-48"}
            onClick={(e) => {
              if (e.key === "logout") {
                localStorage.clear();
                navigate("/");
              }
              if (e.key === "setting") {
                setIsModalOpen(true);
              }
              if (e.key === "git") {
                vm
                  ? navigate(`/connectGithub?vm=${vm}`)
                  : navigate(`/connectGithub`);
              }
              if (e.key === "standard") {
                setIsOpen(true);
              }
            }}
          />
        </div>
      </>
    );
  };

  const items = [
    getItem(`${fullname}`, "sub4", <UserOutlined />, [
      getItem(`${fullname}`, "9", <UserOutlined />),
      getItem("Change Password", "setting", <SettingOutlined />),
      getItem("New Standard", "standard", <SettingOutlined />),
      getItem("Your Github", "git", <GithubOutlined />),
      getItem("Logout", "logout", <LogoutOutlined />),
    ]),
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
          {nodeRight()}
        </div>

        <div className=" grid grid-cols-6 w-72 mr-3 text-center items-center justify-center">
          {nodeLeft()}
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
    </>
  );
}
