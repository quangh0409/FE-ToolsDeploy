import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useEffectOnce from "../../hook/useEffectOnce";
import socket from "../../utils/socket/socket";
import apiCaller from "../../apis/apiCaller";
import githubApi from "../../apis/github.api";
import ticketApi from "../../apis/ticket.api";

export default function HandleCallback() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const auth = params.get("code");
  const navigate = useNavigate();

  useEffectOnce(() => {
    const fetchAccessToken = async () => {
      await apiCaller({
        request: githubApi.loginByGithub(auth),
      });
      await apiCaller({
        request: ticketApi.getTicketDetail(),
      });
      navigate("/dashboard");
      socket.connect();
      socket.emit("register", localStorage.getItem("accessToken"));
    };

    fetchAccessToken();
  }, []);

  return <div> Waiting for minutes</div>;
}
