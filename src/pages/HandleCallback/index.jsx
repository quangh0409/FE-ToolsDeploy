import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginByGithub } from "../../apis/github.api";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";
import socket from "../../utils/socket/socket";

export default function HandleCallback() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const auth = params.get("code");
  const navigate = useNavigate();

  useEffectOnce(() => {
    const fetchAccessToken = async () => {
      await loginByGithub(auth);
      await getTicketDetail();
      navigate("/dashboard");
      socket.connect();
      socket.emit("register", localStorage.getItem("accessToken"));
      socket.on("webhooks", (user_id) => {
        if(user_id){
          
        }
      });
    };

    fetchAccessToken();
  }, []);

  return <div> Waiting for minutes</div>;
}
