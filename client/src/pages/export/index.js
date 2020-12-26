import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";
import { MainContext } from "../../context/main";
import { Event, SocketContext } from "react-socket-io";
import Loading from "../../components/loading";
import Prompt from "../../components/prompt";

const Export = () => {
  useEffect(() => {}, []);

  const socket = useContext(SocketContext);
  const { state, dispatch } = useContext(MainContext);
  const { mctDocument, exportedBlog, isExporting } = state;
  const history = useHistory();

  const handleExportBlog = (mctDocument) => {
    dispatch({
      type: "INIT_EXPORT",
      payload: {}
    });
    socket.emit("export-blog", { mctDocument });
  };

  const handleUpdateExportedBlog = ({ exportedBlog }) => {
    dispatch({
      type: "SET_EXPORT",
      payload: {
        exportedBlog,
      },
    });
  };

  if (isExporting) {
    return (
      <React.Fragment>
        <Loading message={"Exporting blog..."} />
        <Event event="update-exported-blog" handler={handleUpdateExportedBlog} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="export-section">
        {exportedBlog && (
          <div className="exported-blog-preview">
            <div className="exported-blog-reexport-btn" onClick={() => handleExportBlog(mctDocument)}>
              Re-Export Blog
            </div>
            <div className="exported-blog-location">
              Your blog has been exported to
              <div className="exported-blog-path">{exportedBlog.exportPath}</div>
            </div>
            <div className="exported-blog-markdown-code">
              <pre>
                <code>
                  {exportedBlog.fileContent}
                </code>
              </pre>
            </div>
          </div>
        )}
        {!exportedBlog &&
          <Prompt
            actionMessage={"Export Blog"}
            actionDescription={"Generate a blog-safe markdown export of your mct document which can be used in a github readme or jekyll compatible blog"}
            condition={mctDocument !== null}
            handleClickAction={() => handleExportBlog(mctDocument)}
            handleClickHelp={() => history.push("/")}
            helpMessage={"Please select a file to edit."}
          />
        }
      </div>
      <Event event="update-exported-blog" handler={handleUpdateExportedBlog} />
    </React.Fragment>
  );

};

export default Export;
