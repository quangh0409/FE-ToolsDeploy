import React, { useState } from "react";
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



  const columns = [
    {
      title: `Service name`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      dataIndex: "service_name",
      key: "service_name",
      render: (text) => (<div><GlobalOutlined />{text}</div>)
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
