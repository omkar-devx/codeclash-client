import { Link } from "@tanstack/react-router";
import React from "react";

const Header = () => {
  return (
    <div>
      <ul className="flex gap-x-4 ">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/problemset">Problems</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
