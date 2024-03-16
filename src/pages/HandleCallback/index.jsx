import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../apis/github.api";
import useEffectOnce from "../../hook/useEffectOnce";

export default function HandleCallback() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const auth = params.get("code");
  const navigate = useNavigate();

  useEffectOnce(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessToken(auth);
      console.log("🚀 ~ fetchAccessToken ~ token:", token)
      localStorage.setItem("access-token-git",token)
      navigate("/dashboard");
    };

    fetchAccessToken();
  }, []);

  return <div> Waiting for minutes</div>;
}
