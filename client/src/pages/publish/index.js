import React, { useEffect, useContext } from "react";
import "./index.css";
import { MainContext } from "../../context/main";
import { Event, SocketContext } from "react-socket-io";
import Loading from "../../components/loading";
import Prompt from "../../components/prompt";
import { useHistory } from "react-router-dom";

const Publish = () => {
  useEffect(() => {}, []);

  const socket = useContext(SocketContext);
  const { state, dispatch } = useContext(MainContext);
  const { mctDocument, isPublishing, publishedDraft } = state;
  const history = useHistory();

  const handlePublishMediumDraft = (mctDocument) => {
    dispatch({
      type: "INIT_PUBLISH",
      payload: {},
    });
    socket.emit("publish-medium-draft", { mctDocument });
  };

  const handleUpdatePublishedMediumDraft = ({ publishedDraft }) => {
    dispatch({
      type: "SET_PUBLISH",
      payload: {
        publishedDraft,
      },
    });
  };

  if (isPublishing) {
    return (
      <React.Fragment>
        <Loading message={"Publishing..."} />
        <Event
          event="update-published-medium-draft"
          handler={handleUpdatePublishedMediumDraft}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="publish-section">
        {publishedDraft && (
          <div className="published-draft-preview">
            <div
              className="published-draft-republish-btn"
              onClick={() => handlePublishMediumDraft(mctDocument)}
            >
              Re-Publish Draft
            </div>
            <div className="published-draft-location">
              Your draft has been published to
              <div className="published-draft-path">
                <a
                  href={publishedDraft.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {publishedDraft.url}
                </a>
              </div>
            </div>
            <div className="published-draft-markdown-code">
              <pre>
                <code>{publishedDraft.content}</code>
              </pre>
            </div>
          </div>
        )}
        {!publishedDraft && (
          <Prompt
            actionMessage={"Publish Draft"}
            actionDescription={
              "Auto generate any required github gists and publish your blog as a draft directly to your medium.com account."
            }
            condition={mctDocument !== null}
            handleClickAction={() => handlePublishMediumDraft(mctDocument)}
            handleClickHelp={() => history.push("/")}
            helpMessage={"Please select a file to edit."}
          />
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
