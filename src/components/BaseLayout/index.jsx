import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import socket from "../../utils/socket/socket";
import { useNavigate } from "react-router-dom";
import apiCaller from "../../apis/apiCaller";
import ticketApi from "../../apis/ticket.api";

export default function BaseLayout(props) {
  const navigate = useNavigate();
  useEffect(() => {
    socket.connect();
    const fetch = async () => {
      if (localStorage.getItem("accessToken")) {
        await apiCaller({
          request: ticketApi.getTicketDetail(),
        });
      } else {
        navigate("/");
      }
    };
    fetch();
    socket.on(
      `webhooks-${localStorage.getItem("UserId")}`,
      (user_id, service, env) => {
        console.log("đã nhận lời nhắc từ BE");
        localStorage.setItem("build", true);
        const currentUrl = `/ocean?service=${service}&env=${env}`;
        if (window.location.pathname + window.location.search === currentUrl) {
          window.location.href = currentUrl; // Buộc tải lại trang
        } else {
          window.location.href = currentUrl;
        }
      }
    );
  }, [localStorage]);

  return (
    <div className="flex flex-col min-h-[100vh] h-screen">
      <Header />
      <hr></hr>
      {props.children}

      <Footer />
    </div>
  );
}
