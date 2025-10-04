import Header from "@/components/Header";
import { Link, Outlet } from "@tanstack/react-router";
import React from "react";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Outlet className="flex-1 min-h-0" />
    </div>
  );
};

export default Layout;
