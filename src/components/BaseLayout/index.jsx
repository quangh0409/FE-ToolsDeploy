import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";
import socket from "../../utils/socket/socket";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BaseLayout(props) {
  const navigate = useNavigate();
  const user = useSelector((state) => {
    return state.user.user_id;
  });
  socket.on("webhooks", (user_id) => {
    if (user_id === user) {
      console.log("ok");
    }
  });
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
