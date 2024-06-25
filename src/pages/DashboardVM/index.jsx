import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import apiCaller from "../../apis/apiCaller";
import vmsApi from "../../apis/vms.api";
import { Button, Input, message } from "antd";
import React from "react";
import {
  CheckCircleTwoTone,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import useEffectOnce from "../../hook/useEffectOnce";
export default function DashboardVM() {
  const vms_ids = useSelector((state) => state.user.ticket.vms_ids);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const intervalRef = useRef(null);
  const fetch = async (host, vms_ids) => {
    const res = await apiCaller({
      request: vmsApi.getVmsByIds(vms_ids, host),
    });
    if (!res?.code) {
      setVms(res);
      setLoading(false);
    } else {
      setLoading(true);
      message.error(res.errors[0].message);
    }
  };

  useEffect(() => {
    fetch(search, vms_ids);
  }, [vms_ids]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Đợi 500ms sau khi người dùng ngừng nhập

    return () => {
      clearTimeout(handler);
    };
  }, [search, vms_ids]);

  // //Effect để gọi API liên tục với giá trị debouncedSearch
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetch(debouncedSearch, vms_ids);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [debouncedSearch, vms_ids]);

  function subtractTime(time1, time2) {
    // Chuyển đổi thời gian thành mili giây
    let t1 = new Date(time1).getTime();
    let t2 = new Date(time2).getTime();

    // Tính toán sự khác biệt
    let diff = Math.abs(t1 - t2);

    // Chuyển đổi sự khác biệt thành phút và giây
    let minutes = Math.floor(diff / 60000);
    let seconds = ((diff % 60000) / 1000).toFixed(0);

    // Trả về kết quả dưới dạng chuỗi
    return minutes + "m " + seconds + "s";
  }

  const expandedRowRender = (ParentRecord) => {
    const columns = [
      {
        title: "WEBAPP",
        key: "name",
        render: (record, idx) => {
          if (record?.name)
            return (
              <>
                <div
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigate(
                      `/vm-instance/detail?id=${record?.id}&env=${record?.env_name}`
                    );
                  }}
                >
                  {`${record?.name ? record?.name : "N/A"}`}
                </div>
              </>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "ARCHITECTURE",
        dataIndex: "architecture",
        key: "architecture",
      },
      {
        title: "LANGUAGE",
        dataIndex: "language",
        key: "language",
      },
      {
        title: "REPOSITORY",
        key: "repo",
        render: (record) => <a href={record?.source}>{record?.repo}</a>,
      },
      {
        title: "ENVIRONMENT",
        dataIndex: "env_name",
        key: "env_name",
      },
      {
        title: "LAST COMMIT",
        key: "commit",
        render: (record) => {
          return (
            <>
              <a
                href={record?.last_record?.commit_html_url}
                className="cursor-pointer hover:text-blue-500"
              >
                <div>{record?.last_record?.commit_id?.substring(0, 6)}</div>
                <div>{record?.last_record?.commit_message}</div>
              </a>
            </>
          );
        },
      },
      {
        title: "LAST PIPELINE CI/CD",
        key: "index",
        render: (record) => {
          if (record?.last_record)
            return (
              <>
                <div
                  className="flex gap-2 cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigate(
                      `/ocean?service=${record?.last_record?.id}&env=${record?.env_name}&name=${record?.name}&record=${record?.last_record?.id}`
                    );
                  }}
                >
                  <div>
                    {record?.last_record?.status === "SUCCESSFULLY" ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    )}
                  </div>
                  <div>{`#${record?.last_record?.index} (${timeDifference(
                    record?.last_record?.created_time,
                    new Date()
                  )} ago)`}</div>
                </div>
              </>
            );
        },
      },
      {
        title: "DURATION",
        key: "duration",
        render: (record) => {
          if (record?.last_record)
            return (
              <div className="flex gap-1">
                <div>
                  <ClockCircleOutlined style={{ color: "blue" }} />
                </div>
                <div>
                  {subtractTime(
                    record?.last_record?.created_time,
                    record?.last_record?.end_time
                  )}
                </div>
              </div>
            );
          else return <div>N/A</div>;
        },
      },
      {
        title: "ACTIONS",
        key: "actions",
        render: (record) => (
          <div className="flex gap-2">
            <div></div>
            <div
              className="flex cursor-pointer  hover:text-blue-500"
              onClick={() => {}}
            >
              <div>
                <EyeOutlined />
              </div>
              <div>Detail</div>
            </div>
            <div
              className="flex gap-0 cursor-pointer hover:text-blue-500"
              onClick={async () => {
                const res = await apiCaller({
                  request: vmsApi.deleteEnvService(record.id, record.env_name),
                });
                if (res?.code) {
                  message.error(res?.errors[0].message);
                } else {
                  await fetch("");
                  message.info("DELETE SUCCESSFULLY");
                }
              }}
            >
              <div>
                <DeleteOutlined />
              </div>
              <div>Delete</div>
            </div>
          </div>
        ),
      },
    ];
    const data = ParentRecord?.service_info
      ? ParentRecord.service_info.map((service, idx) => {
          return {
            key: idx.toString(),
            ...service,
          };
        })
      : [];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const columns = [
    {
      title: "CLOUD PLARFORM",
      key: "kernel",
      width: 140,
      render: (record, index) => {
        return (
          <>
            <div className="flex justify-between text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  navigate(`/vm-instance?vm=${record.id}`);
                }}
              >
                {record?.checkip?.name?.includes("Google") ? (
                  <img className="w-9 bg-white" src="/images/logoGCP.png" />
                ) : record?.checkip?.name?.includes("CLOUDFLY") ? (
                  <img
                    className="w-12 bg-white"
                    src="https://cloudfly.vn/image/logo/favicon.ico"
                  />
                ) : record?.checkip?.name?.includes("Viettel") ? (
                  <img
                    className="w-9 bg-white"
                    src="https://viettelidc.com.vn/Themes/itmetech/img/logo-IDC-2.png"
                  />
                ) : (
                  "N/A"
                )}
              </div>
              <div className="flex items-center justify-center">
                <p className="text-xs text-right capitalize">
                  {record?.checkip?.name.toLowerCase()}
                </p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "OS",
      width: 100,
      key: "operating_system",
      dataIndex: "operating_system",
    },
    {
      title: "HOST",
      dataIndex: "host",
      key: "host",
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
      title: "STORAGE",
      key: "storage",
      width: 100,
      render: (record) => {
        if (record?.storage)
          return (
            <>
              <div>
                {`free ${record?.storage?.remainingSize}GB (total ${record?.storage?.totalSize}GB)`}
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "RAM",
      key: "ram",
      width: 100,
      render: (record) => {
        if (record?.ram_info)
          return (
            <>
              <div>
                {`free ${record?.ram_info?.free} (total ${record?.ram})`}
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "CPU",
      key: "cpu",
      width: 105,
      render: (record) => {
        if (record?.cpu_info)
          return (
            <>
              <div>
                {`free ${record?.cpu_info?.freeCPU} (total ${record?.cpus}vCPU)`}
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "CONTANIERS",
      key: "container",
      render: (record) => {
        return (
          <div
            className="flex cursor-pointer gap-1 hover:text-blue-500"
            onClick={() => {
              navigate(`/vm-instance?vm=${record.id}&type=containers`);
            }}
          >
            <div>{record?.containers && <Badge status="success" />}</div>
            <div>
              {record?.containers ? `${record.containers} running` : "N/A"}{" "}
            </div>
          </div>
        );
      },
    },
    {
      title: "IMAGES",
      key: "images",
      render: (record) => {
        return (
          <div
            className="flex cursor-pointer gap-1 hover:text-blue-500"
            onClick={() => {
              navigate(`/vm-instance?vm=${record.id}&type=images`);
            }}
          >
            <div>{record?.images && <Badge status="success" />}</div>
            <div>{record?.images ? `${record.images} builded` : "N/A"} </div>
          </div>
        );
      },
    },
    {
      title: "WEBAPPS",
      key: "webapps",
      render: (record, index) => {
        return (
          <div
            className="flex cursor-pointer gap-1 hover:text-blue-500"
            onClick={() => {
              navigate(`/vm-instance?vm=${record.id}`);
            }}
          >
            {record?.services.length} deployed
          </div>
        );
      },
    },
    {
      title: "LAST WEBAPP",
      key: "last_webapp",
      render: (record, idx) => {
        if (record?.last_service)
          return (
            <div>
              <div
                className="cursor-pointer hover:text-blue-500"
                onClick={() => {
                  navigate(
                    `/vm-instance/detail?id=${record?.last_service?.service_id}&env=${record?.last_service?.last_record?.env_name}`
                  );
                }}
              >
                {`${
                  record?.last_service?.service_name
                    ? record?.last_service?.service_name
                    : "N/A"
                }`}
              </div>
            </div>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "LAST REPOSITORY",
      key: "repository",
      render: (record, idx) => {
        if (record?.last_service)
          return (
            <>
              <a
                className="cursor-pointer"
                href={`${
                  record?.last_service?.source
                    ? record?.last_service?.source
                    : "#"
                }`}
              >
                {`${
                  record?.last_service?.repo
                    ? record?.last_service?.repo
                    : "N/A"
                }`}
              </a>
            </>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "BRANCH",
      key: "branch",
      render: (record) => {
        if (record?.last_service)
          return (
            <a
              href={`${record?.last_service?.source}/tree/${record?.last_service?.last_record?.branch}`}
            >
              {record?.last_service?.last_record?.branch}
            </a>
          );
        else return <div>N/A</div>;
      },
    },
    {
      title: "LAST PIPELINE CI/CD",
      key: "pipeline",
      width: 160,
      render: (record) => {
        if (record?.last_service)
          return (
            <>
              <div
                className="flex gap-2 cursor-pointer hover:text-blue-500"
                onClick={() => {
                  navigate(
                    `/ocean?service=${record?.last_service?.service_id}&env=${record?.last_service?.last_record?.env_name}&name=${record?.last_service?.service_name}&record=${record?.last_service?.last_record?.id}`
                  );
                }}
              >
                <div>
                  {record?.last_service?.last_record?.status ===
                  "SUCCESSFULLY" ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                  )}
                </div>
                <div>{`#${
                  record?.last_service?.last_record?.index
                } (${timeDifference(
                  record?.last_service?.last_record?.created_time,
                  new Date()
                )} ago)`}</div>
              </div>
            </>
          );
        else return <div>N/A</div>;
      },
    },

    {
      title: "DURATION",
      key: "duration",
      render: (record) => {
        if (record?.last_service?.last_record)
          return (
            <div className="flex gap-1">
              <div>
                <ClockCircleOutlined style={{ color: "blue" }} />
              </div>
              <div>
                {subtractTime(
                  record?.last_service?.last_record?.created_time,
                  record?.last_service?.last_record?.end_time
                )}
              </div>
            </div>
          );
        else return <div>N/A</div>;
      },
    },

    {
      title: "ACTIONS",
      key: "actions",
      render: (record) => (
        <div className="flex gap-2">
          <div></div>
          <div
            className="flex cursor-pointer  hover:text-blue-500"
            onClick={() => {
              navigate(`/vm-instance?vm=${record.id}`);
            }}
          >
            <div>
              <EyeOutlined />
            </div>
            <div>Detail</div>
          </div>
          <div
            className="flex gap-0 cursor-pointer hover:text-blue-500"
            onClick={async () => {
              const res = await apiCaller({
                request: vmsApi.deleteVmsById(record.id),
              });
              if (res?.code) {
                message.error(res?.errors[0].message);
              } else {
                message.info("DELETE SUCCESSFULLY");
                fetch("");
              }
            }}
          >
            <div>
              <DeleteOutlined />
            </div>
            <div>Delete</div>
          </div>
          <div
            className="flex cursor-pointer hover:text-blue-500"
            onClick={() => {
              navigate(`/dashboard/VM-connect?vm=${record.id}`);
            }}
          >
            <SettingOutlined />
            <div>Setting</div>
          </div>
        </div>
      ),
    },
  ];

  function timeDifference(time1, time2) {
    let date1 = new Date(time1).getTime();
    let date2 = new Date(time2).getTime();

    let diffInMs = Math.abs(date2 - date1);
    let diffInSecs = Math.floor(diffInMs / 1000);
    let mins = Math.floor(diffInSecs / 60);
    let secs = diffInSecs % 60;
    let hours = Math.floor(mins / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${mins}m ${secs}s`;
    }
  }

  return (
    <>
      <div className="ml-24 mr-24 h-full">
        <div className="text-3xl font-medium">VM-INSTANCE DEPLOYMENT</div>
        <div className="mt-9">
          <Input
            placeholder="Enter your repository"
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
              console.log(e.target.value);
              if (e.key === "Enter") {
                setSearch(e.target.value);
                // const res = await apiCaller({
                //   request: vmsApi.getVmsByIds(vms_ids, e.target.value),
                // });
                // setVms(res);
                fetch(e.target.value);
              }
              if (e.target.value === "") {
                setSearch(e.target.value);
                // const res = await apiCaller({
                //   request: vmsApi.getVmsByIds(vms_ids, ""),
                // });
                // setVms(res);
                fetch(e.target.value);
              }
            }}
            suffix={
              <Button
                className="text-gray-400 pointer-events-auto border-0 "
                onClick={(e) => {
                  e.preventDefault();
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
              columns={columns}
              loading={loading}
              expandable={{
                expandedRowRender,
                defaultExpandedRowKeys: ["0"],
              }}
              dataSource={
                vms
                  ? vms.map((vm, idx) => {
                      return {
                        key: idx.toString(),
                        ...vm,
                      };
                    })
                  : []
              }
              size="small"
            />
          </div>
        </div>
      </div>
    </>
  );
}
