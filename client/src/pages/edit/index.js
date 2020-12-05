import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";
import { Event, SocketContext } from "react-socket-io";
import { MainContext } from "../../context/main";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Edit = () => {
  const { state } = useContext(MainContext);
  const { mctDocument } = state;

  return (
    <div className="edit-container">
      <div className="file-preview">
        {mctDocument ? (
          <React.Fragment>
            <FrontMatter {...mctDocument.meta} />
            <MctDocument components={mctDocument.components} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="no-file-selected">Please select a file...</div>
          </React.Fragment>
        )}
      </div>
      <div className="editing-tools">
        {mctDocument ? (
          <React.Fragment>
            <ImageUploader title={mctDocument.meta.title} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="no-file-selected">Please select a file...</div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const FrontMatter = ({ title, description, date, tags, path }) => {
  const Tags = ({ tags }) => {
    return (
      <div className="front-matter-tags">
        Tags:
        {_.map(tags, (tag) => {
          return <div key={tag} className="front-matter-tag">{tag}</div>;
        })}
      </div>
    );
  };

  const Value = ({ value }) => {
    if (value) {
      return <span className="front-matter-bold">{value}</span>;
    }
    return <span className="front-matter-missing">MISSING</span>;
  };

  return (
    <div className="front-matter">
      <div className="front-matter-path">
        Currently Editing: <Value value={path} />
      </div>
      <div className="front-matter-title">
        Title: <Value value={title} />
      </div>
      <div className="front-matter-description">
        Description: <Value value={description} />
      </div>
      <div className="front-matter-date">
        Date: <Value value={moment(date).format("dddd, MMMM Do YYYY")} />
      </div>
      <Tags tags={tags} />
    </div>
  );
};

const MarkdownSlide = ({ content }) => {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

const Codeblock = ({ header, filename, content }) => {
  return (
    <div className="codeblock">
      <div className="codeblock-header">{header}</div>
      <div
        className="codeblock-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="codeblock-filename">{filename}</div>
    </div>
  );
};

const MctDocument = ({ components }) => {
  return _.map(components, (component) => {
    if (component.type === "codeblock") {
      return (
        <Codeblock key={component.id} {...component.meta} content={component.content.markup} />
      );
    } else {
      return (
        <MarkdownSlide key={component.id} content={component.content.markup} />
      );
    }
  });
};

const ImageUploader = ({ title }) => {
  const socket = useContext(SocketContext);
  const [inputValue, setInputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [isCopied])

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === "file") {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (event) {
          socket.emit("paste-image", {
            data: event.target.result,
            title,
          });
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleImageUrl = ({ path }) => {
    setInputValue(path);
  }

  const handleCopy = () => {
    setInputValue('');
    setIsCopied(true);
  }

  return (
    <React.Fragment>
      <input
        onPaste={handlePaste}
        type="text"
        placeholder="Paste image here."
        value={inputValue}
      />
      <CopyToClipboard
        text={inputValue}
        onCopy={handleCopy}
      >
        <button>{isCopied ? 'Copied.' : 'Copy To Clipboard.'}</button>
      </CopyToClipboard>
      <Event event="image-url" handler={handleImageUrl} />
    </React.Fragment>
  );
}

export default Edit;
