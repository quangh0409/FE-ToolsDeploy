import React from "react";
import {
  CheckCircleTwoTone,
  ClockCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../redux/store";
import { addVm, setDeploy, setRowKeys } from "../../redux/reducer/user";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
export default function VMTable(props) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const rowKeys = useSelector((state) => state.user.rowKeys);
  let deploy = useSelector((state) => state.user.deploy);
  if (deploy?.loading) {
    deploy = JSON.parse(localStorage.getItem("deploy"));
    store.dispatch(setDeploy(deploy));
  }
  const onSelectChange = (selectedRowKeys) => {
    store.dispatch(setRowKeys(selectedRowKeys));
  };
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
  const onSelect = (record) => {
    console.log(
      "🚀 ~ VMTable ~ record, selected, selectedRows, nativeEvent:",
      record
    );
    store.dispatch(
      setDeploy({
        ...deploy,
        vm: {
          id: record?.id,
          host: record?.host,
        },
        environment: {
          ...deploy.environment,
          vm: {
            id: record?.id,
            host: record?.host,
          },
        },
      })
    );
    localStorage.setItem(
      "deploy",
      JSON.stringify({
        ...deploy,
        vm: {
          id: record?.id,
          host: record?.host,
        },
        environment: {
          ...deploy.environment,
          vm: {
            id: record?.id,
            host: record?.host,
          },
        },
      })
    );
  };

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
        render: () => (
          <div>
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
                className="flex items-center justify-center cursor-pointer hover:text-blue-500"
                onClick={() => {
                  store.dispatch(addVm(record.id));
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
          <div className="flex gap-1">
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
          <div className="flex gap-1">
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
        return <div>{record?.services.length} deployed</div>;
      },
    },
    {
      title: "LAST WEBAPP",
      key: "last_webapp",
      render: (record, idx) => {
        if (record?.last_service)
          return (
            <>
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
            </>
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
                className="cursor-pointer hover:text-blue-500"
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
                className="flex gap-2 cursor-pointer hover:text-blue-500 "
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
      render: () => (
        <div>
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
      <Table
        columns={columns}
        loading={props.loading}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={
          props?.vms
            ? props.vms.map((vm, idx) => {
                return {
                  key: idx.toString(),
                  ...vm,
                };
              })
            : []
        }
        size="small"
        rowSelection={
          // on,
          expanded
            ? undefined
            : {
                type: "radio",
                columnWidth: 48,
                onSelect: onSelect,
                onChange: onSelectChange,
                defaultSelectedRowKeys: rowKeys,
              }
        }
      />
    </>
  );
}
