import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE } from "../constants/router";
import SignInPage from "../pages/SignInPage";
import BaseLayout from "../components/BaseLayout";
import HandleCallback from "../pages/HandleCallback";
import Dashboard from "../pages/Dashboard";
import ConnectGit from "../pages/ConnectGit";
import Newwebapp from "../pages/NewWebapp";

export default function AppRouter() {
  const routes = [
    { path: ROUTE.SIGNIN, element: SignInPage },
    { path: ROUTE.HANDLECALLBACK, element: HandleCallback },
    { path: ROUTE.DASHBOARD, element: Dashboard },
    { path: ROUTE.CONNECTGITHUB, element: ConnectGit },
    { path: ROUTE.NEWWEBAPP, element: Newwebapp },
  ];

  return (
    <>
      <Routes>
        {routes.map((route) => {
          const { element: Component } = route;
          if (route.path === "/") {
            return (
              <Route
                key={route.path}
                {...route}
                element={
                  <BaseLayout>
                    <Component />
                  </BaseLayout>
                }
              ></Route>
            );
          } else {
            return (
              <Route
                key={route.path}
                {...route}
                element={
                  <BaseLayout>
                    <Component />
                  </BaseLayout>
                }
              ></Route>
            );
          }
        })}
      </Routes>
    </>
  );
}
