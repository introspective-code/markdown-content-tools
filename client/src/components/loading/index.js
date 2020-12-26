import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = ({ message }) => {
  return (
    <div className="loading-area">
      {message && <div className="loading-message">{message}</div>}
      <FontAwesomeIcon icon={faSpinner} size="3x" pulse />
    </div>
  );
};

export default Loading;
