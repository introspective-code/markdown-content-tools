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
  const { mctDocument, isPublishing, publishedDraft, publishedBlog } = state;
  const history = useHistory();

  const handlePublishMediumDraft = (mctDocument) => {
    dispatch({
      type: "INIT_PUBLISH_MEDIUM_DRAFT",
      payload: {},
    });
    socket.emit("publish-medium-draft", { mctDocument });
  };

  const handlePublishJekyllBlog = (mctDocument) => {
    dispatch({
      type: "INIT_PUBLISH_JEKYLL_BLOG",
      payload: {},
    });
    socket.emit("publish-jekyll-blog", { mctDocument });
  };

  const handleUpdatePublishedMediumDraft = ({ publishedDraft }) => {
    dispatch({
      type: "SET_PUBLISH_MEDIUM_DRAFT",
      payload: {
        publishedDraft,
      },
    });
  };

  const handleUpdatePublishedJekyllBlog = ({ publishedBlog }) => {
    dispatch({
      type: "SET_PUBLISH_JEKYLL_BLOG",
      payload: {
        publishedBlog,
      },
    });
  };

  const handleOpenPublishedJekyllBlog = path => {
    socket.emit("open-file", { path });
  }

  if (isPublishing) {
    return (
      <React.Fragment>
        <Loading message={"Publishing..."} />
        <Event
          event="update-published-medium-draft"
          handler={handleUpdatePublishedMediumDraft}
        />
        <Event
          event="update-published-jekyll-blog"
          handler={handleUpdatePublishedJekyllBlog}
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
            actionMessage={"Publish Medium Draft"}
            actionDescription={
              "Auto generate any required github gists and publish your blog as a draft directly to your medium.com account."
            }
            condition={mctDocument !== null}
            handleClickAction={() => handlePublishMediumDraft(mctDocument)}
            handleClickHelp={() => history.push("/")}
            helpMessage={"Please select a file to edit."}
          />
        )}
        {publishedBlog && (
          <div className="published-blog-preview">
            <div
              className="published-blog-republish-btn"
              onClick={() => handlePublishJekyllBlog(mctDocument)}
            >
              Re-Publish Jekyll Blog
            </div>
            <div className="published-blog-location">
              Your jekyll blog has been published to
              <div className="published-draft-path">
                <a
                  href={publishedBlog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {publishedBlog.url}
                </a>
              </div>
            </div>
            <div className="published-blog-markdown-code">
              <pre>
                <code>{publishedBlog.content}</code>
              </pre>
            </div>
          </div>
        )}
        {!publishedBlog && (
          <Prompt
            actionMessage={"Publish Jekyll Blog"}
            actionDescription={
              "Export and generate a commit into your jekyll blog local repo to be pushed to github."
            }
            condition={mctDocument !== null}
            handleClickAction={() => handlePublishJekyllBlog(mctDocument)}
            handleClickHelp={() => history.push("/")}
            helpMessage={"Please select a file to edit."}
            hideHelp={true}
          />
        )}
      </div>
      <Event
        event="update-published-medium-draft"
        handler={handleUpdatePublishedMediumDraft}
      />
      <Event
        event="update-published-jekyll-blog"
        handler={handleUpdatePublishedJekyllBlog}
      />
    </React.Fragment>
  );
};

export default Publish;
