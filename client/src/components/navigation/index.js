import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

const Navigation = () => {
  const location = useLocation();

  return (
    <React.Fragment>
      <div className="navigation">
        <Link
          to={"/"}
          className={`navigation-option ${
            location.pathname === "/" ? "navigation-selected" : ""
          }`}
        >
          Select
        </Link>
        <Link
          to={"/edit"}
          className={`navigation-option ${
            location.pathname === "/edit" ? "navigation-selected" : ""
          }`}
        >
          Edit
        </Link>
        <Link
          to={"/export"}
          className={`navigation-option ${
            location.pathname === "/export" ? "navigation-selected" : ""
          }`}
        >
          Export
        </Link>
        <Link
          to={"/publish"}
          className={`navigation-option ${
            location.pathname === "/publish" ? "navigation-selected" : ""
          }`}
        >
          Publish
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Navigation;
