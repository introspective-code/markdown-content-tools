import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { Event, SocketContext } from "react-socket-io";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";

const Home = () => {
  const [mctDocument, setMctDocument] = useState(null);
  const [listedFiles, setListedFiles] = useState([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("list-files");
  }, []);

  const handleUpdateMctDocument = ({
    path,
    components,
    title,
    description,
    date,
    tags,
  }) => {
    setMctDocument({
      components,
      meta: {
        path,
        title,
        description,
        date,
        tags,
      },
    });
  };

  const handleListFiles = ({ files }) => {
    setListedFiles(files);
  };

  const handleClickFile = (file) => {
    socket.emit("edit-file", { file });
  };

  return (
    <React.Fragment>
      {mctDocument ? (
        <React.Fragment>
          <FrontMatter {...mctDocument.meta} />
          <MctDocument components={mctDocument.components} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ListedFiles files={listedFiles} handleClick={handleClickFile} />
        </React.Fragment>
      )}
      <Event event="update-document" handler={handleUpdateMctDocument} />
      <Event event="list-files" handler={handleListFiles} />
    </React.Fragment>
  );
};

const FrontMatter = ({ title, description, date, tags, path }) => {
  const Tags = ({ tags }) => {
    return (
      <div className="front-matter-tags">
        Tags:
        {_.map(tags, (tag) => {
          return <div className="front-matter-tag">{tag}</div>;
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
        <Codeblock {...component.meta} content={component.content.markup} />
      );
    } else {
      return <MarkdownSlide content={component.content.markup} />;
    }
  });
};

const ListedFiles = ({ files, handleClick }) => {
  return (
    <React.Fragment>
      <div className="listed-files-header">
        <div className="listed-files-option listed-files-option-select">
          Select A File
        </div>
        <div className="listed-files-option listed-files-option-new">
          New File
        </div>
      </div>
      <div className="listed-files">
        {_.map(files, (file) => {
          return (
            <div
              key={file}
              onClick={() => handleClick(file)}
              className="listed-file"
            >
              {file}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Home;
