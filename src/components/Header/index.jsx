import React from "react";
import { useLocation } from "react-router-dom";
import MenuCustom, { getItem } from "../MenuCustom";
import {
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function Header() {
  const uri = useLocation();
  console.log(uri);

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
          <div className="col-span-4 text-2xl ml-3 text-center border-black border-solid border-r">
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
          <div>Dashboard</div>
        </>
      );
    }
    return (
      <>
        <div className="col-span-2 border-black border-solid border rounded-lg ">
          <MenuCustom items={NewItems} width={90} className={"rounded-lg"} />
        </div>
        <div className="col-span-4 flex  justify-center">
          <MenuCustom items={items} width={"w-48"} />
        </div>
      </>
    );
  };

  const items = [
    getItem("Vũ Trọng Quảng", "sub4", <UserOutlined />, [
      getItem("Vũ Trọng Quảng", "9", <UserOutlined />),
      getItem("Account Settings", "10", <SettingOutlined />),
      getItem("Logout", "11", <LogoutOutlined />),
    ]),
  ];

  const NewItems = [
    getItem("New", "sub1", <PlusOutlined />, [
      getItem("Webapp", "9", <GlobalOutlined />),
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
