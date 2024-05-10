import React, { useState } from "react";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
  SettingOutlined,
  CaretLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { useSelector } from "react-redux";

export default function ServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vm = params.get("vm");
  const [services, setServices] = useState([]);
  const [reload, setReload] = useState(false);
  const [vmInstance, setVmInstance] = useState();
  const [search, setSearch] = useState();
  const user = useSelector((state) => state.user.user_git);
  useEffect(() => {
    const fetch = async () => {
      const res = await apiCaller({
        request: vmsApi.getAllServiceByVMId(vm),
      });
      setServices(res);
      const vm_instance = await apiCaller({
        request: vmsApi.getVmsById(vm),
      });
      setVmInstance(vm_instance);
    };
    fetch();
    setReload(false);
  }, [vm, reload]);

  const columns = [
    {
      title: `SERVICE NAME`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      key: "service_name",
      render: (record, index) => (
        <div
          onClick={() => {
            const env = record.environment.find((e) => e.vm === vm);
            navigate(`/service/detail?id=${record.id}&env=${env.name}`);
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
              const env = record.environment.find((e) => vm === e.vm);
              navigate(
                `/new-webapp?repo=${record.repo}&user=${user}&clone_url=${record.source}&vm=${env.vm}&service=${record.id}`
              );
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
              const env_name = record.environment.find((e) => vm === e.vm);
              localStorage.setItem("build", true);
              navigate(
                `/ocean?service=${record.id}&env=${env_name.name}&name=${record.service_name}`
              );
            }}
          />
        );
      },
    },
    {
      width: 100,
      title: "Delete",
      key: "delete",
      render: (record, index) => {
        return (
          <DeleteOutlined
            onClick={async () => {
              const res = await apiCaller({
                request: vmsApi.deleteServiceById(record.id, vm),
              });
              setReload(true);
              alert(res.message);
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className=" text-3xl font-medium">Server: {vmInstance?.host}</div>
        <div className="mt-9">
          <Input
            placeholder="Enter your username"
            prefix={
              <SearchOutlined
                className="site-form-item-icon"
                onClick={() => {}}
              />
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={async (e) => {
              setSearch(e.target.value);
              console.log(e.target.value);
              if (e.key === "Enter") {
                const res = await apiCaller({
                  request: vmsApi.findServiceInVmsByName(vm, e.target.value),
                });
                setServices(res);
              }
              if (e.target.value === "") {
                const res = await apiCaller({
                  request: vmsApi.getAllServiceByVMId(vm),
                });
                setServices(res);
              }
            }}
            suffix={
              <Button
                className="text-gray-400 pointer-events-auto border-0 "
                onClick={(e) => {
                  e.preventDefault();
                  console.log(search);
                  setSearch("");
                }}
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
                  user: s.user,
                  environment: s.environment,
                };
              })}
              columns={columns}
              scroll={{ y: 421 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
