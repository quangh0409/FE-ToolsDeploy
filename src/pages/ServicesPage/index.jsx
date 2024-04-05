import React, { useState } from "react";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function ServicePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    {
      title: `SERVICE NAME`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      dataIndex: "service_name",
      key: "service_name",
      render: (text) => (
        <div>
          <GlobalOutlined />
          {text}
        </div>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "STATUS",
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
      title: "LAST DEPLOY",
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
                    navigate(
                      `/service/detail?host=${record.service_name}&name=${record.type}`
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
