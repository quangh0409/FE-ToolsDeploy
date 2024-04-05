import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";
import socket from "../../utils/socket/socket";

export default function BaseLayout(props) {
  useEffectOnce(() => {
    const fetch = async () => {
      if (localStorage.getItem("accessToken")) {
        await getTicketDetail();
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
