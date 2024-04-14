import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Input } from "antd";
import "./style.css";
import Editor from "./textCustomer";

export default function TemplateDetailPage(props) {
  const handleDownload = () => {
    const content = props.contentfile.content;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.contentfile.name}`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 70,
      render: (text) => (
        <p
          className={`${
            text === "info"
              ? "text-blue-400"
              : text === "error"
              ? "text-red-500"
              : "text-yellow-400"
          }`}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Line",
      dataIndex: "line",
      key: "line",
      width: 70,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
  ];
  const dataTable =
    props.resultScanSyntax?.length &&
    props.resultScanSyntax?.map((val, index) => {
      return {
        ...val,
        key: index,
      };
    });

  return (
    <div className="  w-full">
      <div className="flex justify-between mb-6">
        <div className="flex flex-row ">
          <Input
            className="w-40 text-black"
            placeholder="Basic usage"
            value={props?.contentfile?.name || undefined}
            // disabled={props?.contentfile?.name ? true : false}
            onChange={(e) => {
              props.setContentfile({
                name: e.target.value,
                content: props?.contentfile?.content,
                type: props?.contentfile?.type,
              });
            }}
          />
          <p className="justify-center content-center">
            Enter the name and location according to the syntax folder/file_name
          </p>
        </div>
        <Button
          size="large"
          className="bg-[#39AC6D]  text-white"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div className="">
        <div></div>
        <div className="grid grid-cols-3 mt-3  gap-7  h-[500px]">
          <div className="col-span-2 border rounded-lg overflow-auto h-full">
            <Editor
              contentfile={props.contentfile}
              setContentfile={props.setContentfile}
              errorLine={props.errorLine}
            />
          </div>
          <div className="col-span-1 border rounded-lg h-full overflow-auto">
            <Table
              pagination={false}
              dataSource={dataTable}
              columns={columns}
              scroll={{ y: 421 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
