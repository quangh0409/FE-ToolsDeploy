import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Table } from "antd";
import "./style.css";
import Editor from "./textCustomer";

export default function TemplateDetailPage() {
  const [data, setData] = useState([]);

  const name = useParams().tab;
  // const descript = async () => {
  //   const res = await axiosClient.post("/v1/in/tool-checks/trivy", {
  //     content: "vutrongquang/mail",
  //   });
  //   if (res) {
  //     // setDescription(res.data.description);
  //   }
  // };
  // useEffect(() => {
  //   descript();
  // }, []);

  const handleDownload = () => {
    const editor = document.getElementById("editor");
    const content = editor.innerText;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Dockerfile";
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
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
  ];
  const dataTable =
    data?.length &&
    data?.map((val) => {
      return {
        ...val,
      };
    });
  const dataSource = [
    {
      code: "1",
      level: "error",
      line: 32,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
    {
      code: "2",
      level: "John",
      line: 42,
      message: "10 Downing Street",
    },
  ];
  return (
    <div className="  w-full">
      <div className="flex justify-between mb-6">
        <p className="border rounded-xl  p-4">
          {name === "pipeline" ? "Dockerfile" : "ci.yaml"}
        </p>
        <Button
          size="large"
          className="bg-[#39AC6D]  text-white"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div className="">
        <div>
          {/* <button className="text-white px-5 py-2 border rounded-lg bg-black">
            Edit
          </button> */}
          {/* <button
            className="ml-5 px-5 py-2 border rounded-lg"
            onClick={async () => {
              const editor = document.getElementById("editor");
              // const res = await checkHadolint({ content: editor.innerText });
              // console.log(res);
              // setData(res.description);
            }}
          >
            Preview
          </button> */}
        </div>
        <div className="grid grid-cols-3 mt-3  gap-7  h-[500px]">
          <div className="col-span-2 border rounded-lg overflow-auto h-full">
            {/* <div
              id="editor"
              ref={editorRef}
              onKeyUp={handleKeyUp}
              class="editor"
              spellcheck="false"
              contenteditable="true"
              style={{
                border: "1px solid #ccc",
                minHeight: "100px",
                padding: "8px",
              }}
            ></div> */}
            <Editor />
          </div>
          <div className="col-span-1 border rounded-lg h-full overflow-auto">
            {/* {data.map((d) => {
              return (
                <>
                  <div
                    className={`p-2 border-2 border-solid rounded m-4 ${
                      d.level === "info"
                        ? "border-blue-400"
                        : d.level === "error"
                        ? "border-red-500"
                        : "border-yellow-400"
                    }`}
                  >
                    <p>code: {d.code}</p>
                    <p>Level: {d.level}</p>
                    <p>Line: {d.line}</p>
                    <p>mesage: {d.message}</p>
                  </div>
                </>
              );
            })} */}
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns}
              scroll={{ y: 421 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
