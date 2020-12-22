import React, { useEffect, useContext } from "react";
import "./index.css";
import { MainContext } from "../../context/main";
import { Event, SocketContext } from "react-socket-io";

const Export = () => {
  useEffect(() => {}, []);

  const socket = useContext(SocketContext);
  const { state } = useContext(MainContext);
  const { mctDocument } = state;

  const handleExportBlog = (mctDocument) => {
    socket.emit("export-blog", { mctDocument });
  };

  const handleUpdateExportedBlog = (data) => {
    console.log({ data });
  };

  return (
    <React.Fragment>
      <div className="export-section">
        {mctDocument ? (
          <button onClick={() => handleExportBlog(mctDocument)}>
            Export Blog
          </button>
        ) : (
          <div>Please select a file to edit.</div>
        )}
      </div>
      <Event event="update-exported-blog" handler={handleUpdateExportedBlog} />
    </React.Fragment>
  );
};

export default Export;
