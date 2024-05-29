import { Form, Input, Modal, Radio, message } from "antd";
import React, { useState } from "react";
import useEffectOnce from "../../hook/useEffectOnce";
import { useNavigate } from "react-router-dom";
import apiCaller from "../../apis/apiCaller";
import authApi from "../../apis/auth.api";
import socket from "../../utils/socket/socket";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailV1, setEmailV1] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [formv2] = Form.useForm();
  const navigate = useNavigate();
  useEffectOnce(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard");
    }
  });

  const handleLoginWithGithub = () => {
    const client_id = process.env.REACT_APP_CA_GIT_CLIENT_ID ? process.env.REACT_APP_CA_GIT_CLIENT_ID : "66602684d99f3683ebe0"
    // const client_id = "66602684d99f3683ebe0";
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}`
    );
  };
  const handleLogin = async () => {
    const res = await apiCaller({
      request: authApi.login(email, password),
    });

    if (res.accessToken) {
      navigate("/dashboard");
      socket.connect();
    } else {
      message.error("Error login");
    }
  };
  return (
    <>
      <div className="h-svh">
        <div className="flex flex-col mt-52 ml-7">
          <div className="text-3xl w-96 h-10 pl-6 text-center">
            Sign in to ToolsDeploy
          </div>
          <div className="text-xl w-96 h-8 pl-6 text-center">or</div>

          <div className="flex grid-cols-6 w-96 h-14 items-center justify-center pl-6 cursor-pointer">
            <div
              className="w-32 h-14 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3 hover:text-white "
              onClick={handleLoginWithGithub}
            >
              <img className="col-span-1" src="/images/github.png" alt="logo" />
              <div className="col-span-2 text-center ">Github</div>
            </div>
            {/* <div className="col-span-2 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3">
              <img className="col-span-1" src="/images/gitlab.png" alt="logo" />
              <div className="col-span-2 text-center ">Gitlab</div>
            </div>
            <div className="col-span-2 grid grid-cols-3 items-center justify-center border-black border-solid border hover:bg-slate-500 m-3">
              <img className="col-span-1" src="/images/google.png" alt="logo" />
              <div className="col-span-2 text-center ">Google</div>
            </div> */}
          </div>
          <Form form={form} onFinish={handleLogin}>
            <div className="pl-6 font-medium">Email</div>
            <Form.Item
              className="-m-3"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  validator: (rule, value) => {
                    // Biểu thức chính quy kiểm tra định dạng email
                    const emailRegex =
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if (!value || emailRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Invalid email address");
                  },
                },
              ]}
            >
              <Input
                className="w-96 m-6"
                placeholder="your@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </Form.Item>
            <div className="pl-6 font-medium">Password</div>
            <Form.Item
              className="-m-3"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                className="w-96 m-6"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
            <div className="flex justify-between w-96">
              <Radio.Button
                className="pl-6 "
                value="default"
                onClick={() => {
                  form.submit();
                }}
              >
                Sign in
              </Radio.Button>
              <div
                className="underline underline-offset-1 cursor-pointer"
                onClick={async () => {
                  // await apiCaller({
                  //   request: authApi["forgot-password"]()
                  // })
                  setIsModalOpen(true);
                }}
              >
                forgot-password
              </div>
            </div>
          </Form>

          <Modal
            open={isModalOpen}
            footer={false}
            onCancel={() => setIsModalOpen(false)}
            closeIcon={true}
            width={700}
          >
            <div className="text-center">
              <p className="m-6">
                Please enter the email you registered with Github
              </p>
              <Form
                form={formv2}
                onFinish={async () => {
                  const res = await apiCaller({
                    request: authApi["forgot-password"](emailV1),
                  });
                  if (res?.message) {
                    message.info(
                      "A new password has been sent to you. Please check your email"
                    );
                  } else {
                    message.error("error system");
                  }
                }}
              ></Form>
              <Form.Item
                name="emailv1"
                rules={[
                  { required: true, message: "Please input your email!" },
                  {
                    validator: (rule, value) => {
                      // Biểu thức chính quy kiểm tra định dạng email
                      const emailRegex =
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                      if (!value || emailRegex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Invalid email address");
                    },
                  },
                ]}
              >
                <Input
                  className="w-96 m-6"
                  placeholder="your@gmail.com"
                  value={emailV1}
                  onChange={(e) => {
                    setEmailV1(e.target.value);
                  }}
                />
              </Form.Item>
            </div>
            <div className="text-right">
              <Radio.Button
                className="ml-6 "
                value="default"
                onClick={() => {
                  formv2.submit();
                }}
              >
                OK
              </Radio.Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}
