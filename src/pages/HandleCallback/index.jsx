import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginByGithub } from "../../apis/github.api";
import useEffectOnce from "../../hook/useEffectOnce";
import { getTicketDetail } from "../../apis";

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
    };

    fetchAccessToken();
  }, []);

  return <div> Waiting for minutes</div>;
}
