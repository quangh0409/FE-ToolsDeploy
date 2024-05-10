import { Table, Tooltip } from "antd";
import React from "react";

export default function ResultTrivy(props) {
  const severity = {
    UNKNOWN: <span className="text-yellow-300">{`UNKNOWN`}</span>,
    CRITICAL: <span className="text-red-700 font-bold">{`CRITICAL`}</span>,
    HIGH: <span className="text-orange-700">{`HIGH`}</span>,
    MEDIUM: <span className="text-orange-300">{`MEDIUM`}</span>,
    LOW: <span className="text-green-400">{`LOW`}</span>,
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      width: 60,
    },
    {
      title: "Library",
      dataIndex: "library",
    },
    {
      title: "Vulnerability",
      dataIndex: "vulnerabilityID",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      render: (text) => severity[text],
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "InstalledVersion",
      dataIndex: "installedVersion",
      width: 140,
    },
    {
      title: "FixedVersion",
      dataIndex: "fixedVersion",
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 300,
      render: (text) => {
        const content = text.content.split("\n");
        return (
          <>
            <Tooltip title={text.description} overlayClassName="h-24 w-22">
              <p>{content[0]}</p>{" "}
              <a href={content[1]} className="text-blue-300">
                {content[1]}
              </a>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="col-span-3 border rounded-lg p-5">
        {props.Results.map((val) => (
          <>
            <div>
              {val.Target} ({val.Class})
            </div>
            <span>{`Total: ${val?.Vulnerabilities?.length || 0} `}</span>
            <span>{`( `}</span>
            <span className="text-yellow-300">{`UNKNOWN`}</span>
            <span>
              {`: ${
                val?.Vulnerabilities?.filter((v) => v.Severity === "UNKNOWN")
                  .length || 0
              }, `}
            </span>
            <span className="text-green-400">{`LOW`}</span>
            <span>
              {`:
                ${
                  val?.Vulnerabilities?.filter((v) => v.Severity === "LOW")
                    .length || 0
                } `}
            </span>
            <span className="text-orange-300">{`MEDIUM`}</span>
            <span>
              {`: 
                ${
                  val?.Vulnerabilities?.filter((v) => v.Severity === "MEDIUM")
                    .length || 0
                }, `}
            </span>
            <span className="text-orange-700">{`HIGH`}</span>
            <span>
              {`: 
                ${
                  val?.Vulnerabilities?.filter((v) => v.Severity === "HIGH")
                    .length || 0
                }, `}
            </span>
            <span className="text-red-700 font-bold">{`CRITICAL`}</span>
            <span>
              {`:
                ${
                  val?.Vulnerabilities?.filter((v) => v.Severity === "CRITICAL")
                    .length || 0
                })`}
            </span>
            <Table
              scroll={{ y: props?.y | 300 }}
              pagination={false}
              className="col-span-3"
              //   loading={loading}
              bordered
              columns={columns}
              dataSource={val?.Vulnerabilities?.map((val, index) => {
                return {
                  key: index + 1,
                  library: val.PkgName,
                  vulnerabilityID: val.VulnerabilityID,
                  severity: val.Severity,
                  status: val.Status,
                  installedVersion: val.InstalledVersion,
                  fixedVersion: val.FixedVersion,
                  title: {
                    content: `${val.Title}\n${val.PrimaryURL}`,
                    description: val.Description,
                  },
                };
              })}
            />
          </>
        ))}
      </div>
    </>
  );
}
