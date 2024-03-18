import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginByGithub } from "../../apis/github.api";
import useEffectOnce from "../../hook/useEffectOnce";

export default function HandleCallback() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const auth = params.get("code");
  console.log("🚀 ~ HandleCallback ~ auth:", auth);
  const navigate = useNavigate();

  useEffectOnce(() => {
    const fetchAccessToken = async () => {
      await loginByGithub(auth);
      // console.log("🚀 ~ fetchAccessToken ~ token:", token)
      // localStorage.setItem("access-token-git",token)
      navigate("/dashboard");
    };

    fetchAccessToken();
  }, []);

  return <div> Waiting for minutes</div>;
}
