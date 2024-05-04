import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuCustom, { getItem } from "../MenuCustom";
import {
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import useEffectOnce from "../../hook/useEffectOnce";

export default function Header() {
  const uri = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fullname = useSelector((state) => state.user.fullname);
  const vm = params.get("vm")
  //   ? params.get("vm")
  //   : useSelector((state) => state.user.vm);
  // console.log("🚀 ~ Header ~ vm:", vm);

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
              const path = uri.pathname;
              if (path === "/dashboard") {
                navigate("/dashboard/VM-connect");
              } else {
                navigate(`/connectGithub?vm=${vm}`);
              }
            }}
          />
        </div>
        <div className="col-span-4 flex  justify-center">
          <MenuCustom
            items={items}
            width={"w-48"}
            onClick={(e) => {
              if (e.key === "Logout") {
                localStorage.clear();
                navigate("/");
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
      getItem("Account Settings", "10", <SettingOutlined />),
      getItem("Logout", "Logout", <LogoutOutlined />),
    ]),
  ];

  const NewItems = [
    getItem("New", "sub1", <PlusOutlined />, [
      getItem("Webapp", "Webapp", <GlobalOutlined />),
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
    </>
  );
}
