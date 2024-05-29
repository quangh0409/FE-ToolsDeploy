import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE } from "../constants/router";
import SignInPage from "../pages/SignInPage";
import BaseLayout from "../components/BaseLayout";
import HandleCallback from "../pages/HandleCallback";
import Dashboard from "../pages/Dashboard";
import ConnectGit from "../pages/ConnectGit";
import Newwebapp from "../pages/NewWebapp";
import ServicePageDetail from "../pages/ServicePageDetail";
import ConnectVM from "../pages/ConnectVM";
import OceanPage from "../pages/OceanPage";
import ServicePage from "../pages/ServicesPage";
import Test from "../pages/NewWebapp/index";

export default function AppRouter() {
  const routes = [
    { path: ROUTE.SIGNIN, element: SignInPage },
    { path: ROUTE.HANDLECALLBACK, element: HandleCallback },
    { path: ROUTE.DASHBOARD, element: Dashboard },
    { path: ROUTE.CONNECTGITHUB, element: ConnectGit },
    { path: ROUTE.NEWWEBAPP, element: Test },
    { path: ROUTE.SERVICEDETAIL, element: ServicePageDetail },
    { path: ROUTE.VMINSTANCE, element: ServicePage },
    { path: ROUTE.CONNECTVM, element: ConnectVM },
    { path: ROUTE.OCEAN, element: OceanPage },
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
