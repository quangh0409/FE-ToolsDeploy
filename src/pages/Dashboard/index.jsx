import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Table } from "antd";
import {
  CheckCircleTwoTone,
  GlobalOutlined,
  SearchOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import vmsApi, { getVmsByIds } from "../../apis/vms.api";
import { store } from "../../redux/store";
import { addVm } from "../../redux/reducer/user";
import apiCaller from "../../apis/apiCaller";
import ticketApi from "../../apis/ticket.api";
import Standard from "../../components/Standard";

export default function Dashboard() {
  const countRef = useRef(null);
  const [timer, setTimer] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState();
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const ticket_id = useSelector((state) => state.user.ticket.id);
  // countRef.current = setInterval(() => {
  //   setTimer(new Date());
  // }, 1000);
  useEffect(() => {
    if (vms_ids.length > 0) {
      const fetch = async () => {
        const res = await apiCaller({
          request: vmsApi.getVmsByIds(vms_ids),
        });
        console.log("🚀 ~ fetch ~ res:", res);
        setVms(res);
        if (res) {
          setLoading(false);
        } else {
          setLoading(true);
        }
      };
      fetch();
    }
  }, [vms_ids]);
  const columns = [
    {
      title: "CLOUD PLATFORM",
      key: "cloud_platform",
      render: (record, index) => {
        return (
          <div className="flex items-center justify-center">
            {record.cloud_platform?.includes("gcp") ? (
              <img className="w-12 bg-white" src="/images/logoGCP.png" />
            ) : record.cloud_platform?.includes("generic") ? (
              <img className="w-12 bg-white" src="/images/logoAzure.png" />
            ) : (
              "N/A"
            )}
            {/* <div>{record.os}</div> */}
          </div>
        );
      },
    },
    {
      title: "OS",
      key: "os",
      render: (record, index) => {
        return (
          <div className="flex items-center">
            {record.os?.includes("Ubuntu") && (
              <img className="w-8" src="/images/logoUbuntu.png" />
            )}
            <div>{record.os}</div>
          </div>
        );
      },
    },
    {
      title: `HOST`,
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      dataIndex: "host",
      key: "host",
      render: (text) => (
        <div
          className="flex"
          onClick={() => {
            const vm = vms.find((vm) => {
              return vm.host === text;
            });
            store.dispatch(addVm(vm.id));
            navigate(`/vm-instance?vm=${vm.id}`);
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
      key: "last_connect",
      render: (record, index) => {
        return (
          <div>
            {new Date(record.last_connect).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZone: "Asia/Ho_Chi_Minh",
            })}
          </div>
        );
      },
    },
    {
      title: "WebApps",
      key: "webapps",
      render: (record, index) => {
        return <div>{record.services.length} source code</div>;
      },
    },
    {
      title: "Containers",
      key: "containers",
      render: (record, index) => {
        return <div>{record.containers}</div>;
      },
    },
    {
      title: "Images",
      key: "images",
      render: (record, index) => {
        return <div>{record.images}</div>;
      },
    },
    {
      width: 100,
      title: "Setting",
      key: "setting",
      render: (record, index) => {
        console.log("🚀 ~ Dashboard ~ record:", record);
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
    {
      width: 100,
      title: "Delete",
      key: "delete",
      render: (record, index) => {
        return (
          <DeleteOutlined
            onClick={async () => {
              await apiCaller({
                request: vmsApi.deleteVmsById(record.id, ticket_id),
              });
              await apiCaller({
                request: ticketApi.getTicketDetail(),
              });
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
      id: vm.id,
      os: vm.operating_system,
      services: vm.services,
      containers: vm?.containers | 0,
      images: vm?.images | 0,
      cloud_platform: vm?.kernel,
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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={async (e) => {
              setSearch(e.target.value);
              console.log(e.target.value);
              if (e.key === "Enter") {
                const res = await apiCaller({
                  request: vmsApi.findVmsByHost(e.target.value),
                });
                setVms(res);
              }
              if (e.target.value === "") {
                const res = await apiCaller({
                  request: vmsApi.getVmsByIds(vms_ids),
                });
                setVms(res);
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
          <div className="mt-11 col-span-1 border rounded-lg h-full overflow-auto min-w-[1281px]">
            <Table
              pagination={false}
              dataSource={dataTable}
              columns={columns}
              scroll={{ y: 421 }}
              loading={loading}
              className=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
