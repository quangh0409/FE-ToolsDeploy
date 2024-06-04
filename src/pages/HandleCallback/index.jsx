import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useEffectOnce from "../../hook/useEffectOnce";
import socket from "../../utils/socket/socket";
import apiCaller from "../../apis/apiCaller";
import githubApi from "../../apis/github.api";
import ticketApi from "../../apis/ticket.api";
import { message } from "antd";
import authApi from "../../apis/auth.api";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function HandleCallback() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const auth = params.get("code");
  const navigate = useNavigate();
  const [mess, setMess] = useState("");

  useEffectOnce(() => {
    const fetchAccessToken = async () => {
      const res = await apiCaller({
        request: githubApi.loginByGithub(auth),
      });
      await apiCaller({
        request: ticketApi.getTicketDetail(),
      });
      if (res?.code) {
        mess.error(res.errors[0].message);
        setMess(res.errors[0].message);
      } else {
        socket.connect();
        navigate("/dashboard");
      }
      // socket.emit("register", localStorage.getItem("accessToken"));
    };
    const fetchConnectGit = async () => {
      const res = await apiCaller({
        request: authApi.connectGit(auth),
      });
      if (res?.code) {
        mess.error(res.errors[0].message);
        setMess(res.errors[0].message);
      } else {
        mess.info("You connect Github successfully ");
        navigate(`/connectGithub`);
      }
    };

    setTimeout(() => {
      if (localStorage.getItem("connect_github") == 1) {
        fetchConnectGit();
        localStorage.setItem("connect_github", 0);
      } else {
        fetchAccessToken();
      }
    }, 2000);
  }, []);

  return (
    <>
      <div className="flex items-center justify-center">
        {!!mess ? (
          <>
            <ExclamationCircleOutlined /> <span>{mess}</span>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="#" className="w-8" />
        <div> Waiting for minutes</div>
      </div>
    </>
  );
}
