import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";
import socket from "../../utils/socket/socket";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BaseLayout(props) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffectOnce(() => {
    const fetch = async () => {
      if (localStorage.getItem("accessToken")) {
        await getTicketDetail();
        socket.connect();
        socket.emit("register", localStorage.getItem("accessToken"));
      } else {
        navigate("/");
      }
    };
    fetch();
    socket.on("webhooks", (user_id, service, env) => {
      if (user_id === localStorage.getItem("UserId")) {
        const currentUrl = `/ocean?service=${service}&env=${env}`;
        if (window.location.pathname + window.location.search === currentUrl) {
          window.location.href = currentUrl; // Buộc tải lại trang
        } else {
          navigate(currentUrl);
        }
      }
    });
  });

  return (
    <div className="flex flex-col min-h-[100vh] h-screen">
      <Header />
      <hr></hr>
      {props.children}

      <Footer />
    </div>
  );
}
