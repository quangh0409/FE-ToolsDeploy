import axios from "axios";
import React, { useState } from "react";
import useEffectOnce from "../../hook/useEffectOnce";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [src, setSrc] = useState("");
  const navigate = useNavigate();
  useEffectOnce(() => {
    // async function fetchUrl() {
    //   let config = {
    //     method: "get",
    //     maxBodyLength: Infinity,
    //     url: "http://35.213.167.216:8080/job/Demo/job/BE-ToolsDeploy/job/main/1/",
    //     headers: {
    //       Authorization:
    //         "Basic cXVhbmdoMDQwOToxMTA1MWJkOWZiYjE4YjNlMTQ0NWQ1MDNmMmMzMjc0ODJm",
    //       // 'Cookie': 'JSESSIONID.9b86b49a=node016re08x0b2ubo1cva1h2ff0074139.node0'
    //     },
    //     mode: "no-cors",
    //   };

    //   const blob = await axios.request(config);
    //   const response = await fetch("http://35.213.167.216:8080", {
    //     method: "GET",
    //     // auth: {
    //     //   user: "quanh0409",
    //     //   pass: "11051bd9fbb18b3e1445d503f2c327482f"
    //     // },
    //     headers: {
    //       //   // Thêm các headers bạn cần ở đây
    //       Authorization:
    //         "Basic cXVhbmdoMDQwOToxMTA1MWJkOWZiYjE4YjNlMTQ0NWQ1MDNmMmMzMjc0ODJm",
    //       // Các headers khác...
    //       // "X-FRAME-OPTIONS": "SAMEORIGIN",
    //     },
    //     mode: "no-cors", // Đảm bảo rằng mode được đặt là 'cors'
    //   });
    //   // const blob = await response.blob();
    //   const url = URL.createObjectURL(blob);
    //   setSrc(url);
    // }

    // fetchUrl();

    async function fetchUrl() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://35.213.167.216:8080",
        headers: {
          Authorization:
            "Basic cXVhbmdoMDQwOToxMTA1MWJkOWZiYjE4YjNlMTQ0NWQ1MDNmMmMzMjc0ODJm",
        },
        mode: "no-cors",
      };

      try {
        const response = await axios.get(config.url, {
          headers: config.headers,
          maxBodyLength: Infinity,
          // mode: "no-cors",
          responseType: "blob",
        });

        const url = URL.createObjectURL(response.data);
        setSrc(url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUrl();
  }, []);

  const columns = [
    {
      title: `Service name`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      // render: (text) => (
      //   <p
      //     className={`${
      //       text === "info"
      //         ? "text-blue-400"
      //         : text === "error"
      //         ? "text-red-500"
      //         : "text-yellow-400"
      //     }`}
      //   >
      //     {text}
      //   </p>
      // ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div>
          {`${text} `}
          {text === "active" ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CheckCircleTwoTone twoToneColor="#EE9494" />
          )}
        </div>
      ),
    },
    {
      title: "Last Deployed",
      dataIndex: "last_deploy",
      key: "last_deploy",
    },
  ];

  const data = [
    {
      service_name: "1",
      type: "WEBAPP",
      status: "stoped",
      last_deploy: "10 Downing Street",
    },
  ];
  const dataTable =
    data?.length &&
    data?.map((val) => {
      return {
        ...val,
      };
    });

  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className="border-solid border border-cyan-300 text-3xl font-medium">
          Overview
        </div>
        <div className="mt-9">
          <Input
            placeholder="Enter your username"
            prefix={
              <SearchOutlined
                className="site-form-item-icon"
                onClick={() => {}}
              />
            }
            value={""}
            onChange={() => {}}
            suffix={
              <Button
                className="text-gray-400 pointer-events-auto border-0 "
                onClick={() => {}}
              >
                Clear
              </Button>
            }
          />
        </div>
        <div>
          <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto">
            <Table
              pagination={false}
              dataSource={dataTable}
              columns={columns}
              scroll={{ y: 421 }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    console.log(record, rowIndex);
                    navigate(
                      `/service?name=${record.service_name}&type=${record.type}`
                    );
                  },
                };
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
