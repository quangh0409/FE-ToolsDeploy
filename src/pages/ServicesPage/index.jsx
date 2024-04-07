import React, { useEffect, useState } from "react";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
  SettingOutlined,
  CaretLeftOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import useEffectOnce from "../../hook/useEffectOnce";
import { getAllServiceByVMId } from "../../apis";

export default function ServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const [services, setServices] = useState([]);

  useEffectOnce(() => {
    const fetch = async () => {
      const res = await getAllServiceByVMId(vm);
      setServices(res);
    };
    fetch();
  }, [vm]);

  const columns = [
    {
      title: `SERVICE NAME`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      key: "service_name",
      render: (record, index) => (
        <div
          onClick={() => {
            console.log(record);
            navigate(`/service/detail?id=${record.id}`);
          }}
        >
          <GlobalOutlined />
          {record.service_name}
        </div>
      ),
    },
    {
      title: "ARCHITECTURA",
      dataIndex: "architectura",
      key: "architectura",
    },
    {
      title: "LANGUAGE",
      dataIndex: "language",
      key: "language",
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
    {
      width: 100,
      title: "Setting",
      key: "setting",
      render: (record, index) => {
        return (
          <SettingOutlined
            onClick={() => {
              navigate(`/dashboard/VM-connect?vm=${vm.id}`);
            }}
          />
        );
      },
    },
    {
      width: 100,
      title: "Re Build",
      key: "re_build",
      render: (record, index) => {
        return (
          <CaretLeftOutlined
            onClick={() => {
              // const vm = vms.find((vm) => {
              //   return vm.host === record.host;
              // });
              // navigate(`/dashboard/VM-connect?vm=${vm.id}`);
            }}
          />
        );
      },
    },
  ];

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
              dataSource={services.map((s, index) => {
                return {
                  id: s.id,
                  service_name: s.name,
                  architectura: s.architectura,
                  language: s.language,
                  status: "active",
                  last_deploy: new Date().toISOString(),
                  key: index,
                  repo: s.repo,
                  source: s.source,
                  user: s.user
                };
              })}
              columns={columns}
              scroll={{ y: 421 }}
              // onRow={(record, rowIndex) => {
              //   return {
              //     onClick: () => {
              //       navigate(
              //         `/service/detail?host=${record.service_name}&name=${record.type}`
              //       );
              //     },
              //   };
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
