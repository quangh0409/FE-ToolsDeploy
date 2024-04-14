import React, { useEffect, useState } from "react";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getVmsByIds } from "../../apis/vms.api";
import { store } from "../../redux/store";
import { addVm } from "../../redux/reducer/user";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vms, setVms] = useState([]);
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  useEffect(() => {
    if (vms_ids.length > 0) {
      const fetch = async () => {
        const res = await getVmsByIds(vms_ids);
        console.log("🚀 ~ fetch ~ res:", res)
        setVms(res);
      };
      fetch();
    }
  }, [vms_ids]);

  const columns = [
    {
      title: `HOST`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      dataIndex: "host",
      key: "host",
      render: (text) => (
        <div
          onClick={() => {
            const vm = vms.find((vm) => {
              return vm.host === text;
            });
            store.dispatch(addVm(vm.id));
            navigate(`/service?vm=${vm.id}`);
          }}
        >
          <GlobalOutlined />
          {text}
        </div>
      ),
    },
    {
      title: "USER",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div>
          {`${text} `}
          {text === "CONNECTED" ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CheckCircleTwoTone twoToneColor="#EE9494" />
          )}
        </div>
      ),
    },
    {
      title: "LAST CONNECT",
      dataIndex: "last_connect",
      key: "last_connect",
    },
    {
      width: 100,
      title: "Setting",
      key: "setting",
      render: (record, index) => {
        return (
          <SettingOutlined
            onClick={() => {
              const vm = vms.find((vm) => {
                return vm.host === record.host;
              });
              navigate(`/dashboard/VM-connect?vm=${vm.id}`);
            }}
          />
        );
      },
    },
  ];

  const data = vms.map((vm, index) => {
    return {
      host: vm.host,
      user: vm.user,
      status: vm.status,
      last_connect: vm.last_connect,
      key: index,
    };
  });
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
        <div className="text-3xl font-medium">VM Instances</div>
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
