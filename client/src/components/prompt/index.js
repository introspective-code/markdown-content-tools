import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const Prompt = ({
  actionMessage,
  actionDescription,
  handleClickAction,
  handleClickHelp,
  condition,
  helpMessage
}) => {
  return (
    <div className="prompt-area">
      {condition ? (
        <React.Fragment>
          <div className="prompt-action-message" onClick={handleClickAction}>
            {actionMessage}
          </div>
          <div className="prompt-action-description">
            {actionDescription}
          </div>
        </React.Fragment>
      ) : (
        <div className="prompt-help-area" onClick={handleClickHelp}>
          <FontAwesomeIcon icon={faQuestionCircle} size="2x" />
          <div className="prompt-help-message">{helpMessage}</div>
        </div>
      )}
    </div>
  );
};

export default Prompt;
