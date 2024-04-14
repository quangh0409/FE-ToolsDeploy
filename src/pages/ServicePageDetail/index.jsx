import React, { useState } from "react";
import { Route, useLocation, useNavigate } from "react-router-dom";
import { ROUTE, TYPE } from "../../constants/router";
import {
  CopyOutlined,
  GlobalOutlined,
  LinkOutlined,
  MergeOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";

export default function ServicePageDetail(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service_name = params.get("name");
  const service_type = params.get("type");
  console.log("🚀 ~ ServicePageDetail ~ service_type:", TYPE[service_type]);
  const navigate = useNavigate();
  const [url, setUrl] = useState("quangh0409/Decision_help_system");
  const title_iterms = ["Event", "Logs", "Shell", "Images", "Settings"];
  return (
    <>
      <div className="h-full">
        <div className="ml-24 mr-24 mb-10 ">
          <div className=" text-3xl font-medium">
            <GlobalOutlined />
            {TYPE[service_type]}
          </div>
          <div className="mt-2  ">{service_name}</div>
          <div className=" mt-2 ">
            <div className="flex flex-row  col-span-2 grid grid-cols-3 items-center justify-center w-20 ">
              <img className="col-span-1" src="/images/github.png" alt="logo" />
              <div className="col-span-2 flex flex-row ">
                <a href="" className="underline  underline-offset-1">
                  quangh0409/Decision_help_system
                </a>
                <MergeOutlined />
                <a className="underline  underline-offset-1">main</a>
              </div>
            </div>
          </div>
          <div>
            <div className=" mt-2 ">
              <div className="flex flex-row  col-span-2 grid grid-cols-3 items-center justify-center w-20 ">
                <LinkOutlined />
                <div className="col-span-2 flex flex-row ">
                  <a href="" className="underline  underline-offset-1">
                    quangh0409/Decision_help_system
                  </a>
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-24 mr-24 h-full grid grid-cols-6 gap-4 ">
          {/* <div className="col-span-1 border-solid border border-gray-300 rounded-md">
            <div className="grid grid-row-5 gap-1">
              <div className="row-span-1 h-8">Event</div>
              <div className="row-span-1 h-8">Logs</div>
              <div className="row-span-1 h-8">Shell</div>
              <div className="row-span-1 h-8">Images</div>
              <div className="row-span-1 h-8">Settings</div>
            </div>
          </div>
          <div className="col-span-5 border-solid border border-gray-300 rounded-md"></div> */}
          <div
            className="col-span-6 "
            style={{ height: `${600}px` }}
          >
            <Tabs
              className="w-full h-full"
              tabPosition={"left"}
              items={title_iterms.map((t, i) => {
                return {
                  label: `${t}`,
                  key: i,
                  children: `Content of Tab ${i}`,
                };
              })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
