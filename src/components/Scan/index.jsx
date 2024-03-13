import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
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
  return (
    <div className=" px-6 mx-auto pt-10 w-full">
      <div className="flex justify-between mb-6">
        <Button size="large" className="border rounded-xl ">
          {name === "pipeline" ? "Dockerfile" : "ci.yaml"}
        </Button>
        <Button
          size="large"
          className="bg-[#39AC6D]  text-white"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <div>
          {/* <button className="text-white px-5 py-2 border rounded-lg bg-black">
            Edit
          </button> */}
          <button
            className="ml-5 px-5 py-2 border rounded-lg"
            onClick={async () => {
              const editor = document.getElementById("editor");
              // const res = await checkHadolint({ content: editor.innerText });
              // console.log(res);
              // setData(res.description);
            }}
          >
            Preview
          </button>
        </div>
        <div className="grid grid-cols-3 mt-3  gap-7  h-[662px]">
          <div className="col-span-2 border rounded-lg overflow-y-auto h-full">
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
          <div className="col-span-1 border rounded-lg h-full overflow-y-auto">
            {data.map((d) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
