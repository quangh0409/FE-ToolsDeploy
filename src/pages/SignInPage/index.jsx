import { Input, Radio } from "antd";
import React, { useState } from "react";
import useEffectOnce from "../../hook/useEffectOnce";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffectOnce(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard");
    }
  });

  const handleLoginWithGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=66602684d99f3683ebe0"
    );
  };
  return (
    <>
      <div className="h-svh">
        <div className="flex flex-col mt-52 ml-7">
          <div className="text-3xl w-96 h-10 ml-6">Sign in to ToolsDeploy</div>
          <div className="text-xl w-72 h-8 ml-6 text-center">or</div>

          <div className="grid grid-cols-6 w-96 h-14 items-center justify-center ml-3">
            <div
              className="col-span-2 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3"
              onClick={handleLoginWithGithub}
            >
              <img className="col-span-1" src="/images/github.png" alt="logo" />
              <div className="col-span-2 text-center ">Github</div>
            </div>
            <div className="col-span-2 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3">
              <img className="col-span-1" src="/images/gitlab.png" alt="logo" />
              <div className="col-span-2 text-center ">Gitlab</div>
            </div>
            <div className="col-span-2 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3">
              <img className="col-span-1" src="/images/google.png" alt="logo" />
              <div className="col-span-2 text-center ">Google</div>
            </div>
          </div>
          <div className="ml-6 font-medium">Email</div>
          <div>
            <Input
              className="w-96 m-6"
              placeholder="your@gmail.com"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className="ml-6 font-medium">Password</div>
          <div>
            <Input
              className="w-96 m-6"
              placeholder="your@gmail.com"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <Radio.Button
              className="ml-6"
              value="default"
              onClick={handleLoginWithGithub}
            >
              Sign in
            </Radio.Button>
          </div>
        </div>
      </div>
    </>
  );
}
