import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";
import socket from "../../utils/socket/socket";
import { useNavigate } from "react-router-dom";

export default function BaseLayout(props) {
  const navigate = useNavigate();
  useEffectOnce(() => {
    const fetch = async () => {
      if (localStorage.getItem("accessToken")) {
        await getTicketDetail();
      } else {
        navigate("/")
      }
    };
    fetch();
    socket.connect();
    socket.on("webhooks", (data) => {
      console.log("🚀 ~ socket.on webhooks ~ data:", data);
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
