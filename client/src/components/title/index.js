import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

const Title = ({ title }) => {
  return (
    <div className="title">
      <FontAwesomeIcon icon={faMarkdown} /> Markdown <span className="title-bold">{title}</span>
    </div>
  );
};

export default Title;
