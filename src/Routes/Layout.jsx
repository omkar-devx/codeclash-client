import Header from "@/components/Header";
import { Link, Outlet } from "@tanstack/react-router";
import React from "react";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
