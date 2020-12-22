import React, { useEffect, useContext } from "react";
import "./index.css";
import { MainContext } from "../../context/main";
import { Event, SocketContext } from "react-socket-io";

const Publish = () => {
  useEffect(() => {}, []);

  const socket = useContext(SocketContext);
  const { state } = useContext(MainContext);
  const { mctDocument } = state;

  const handlePublishMediaumDraft = (mctDocument) => {
    socket.emit("publish-medium-draft", { mctDocument });
  };

  const handleUpdatePublishedMediumDraft = (data) => {
    console.log({ data });
  };

  return (
    <React.Fragment>
      <div className="export-section">
        {mctDocument ? (
          <button onClick={() => handlePublishMediaumDraft(mctDocument)}>
            Publish Medium Draft
          </button>
        ) : (
          <div>Please select a file to edit.</div>
        )}
      </div>
      <Event
        event="update-published-medium-draft"
        handler={handleUpdatePublishedMediumDraft}
      />
    </React.Fragment>
  );
};

export default Publish;
