import React, { useContext } from "react";
import _ from "lodash";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";
import { MainContext } from "../../context/main";

const Edit = () => {
  const { state } = useContext(MainContext);
  const { mctDocument } = state;

  return (
    <React.Fragment>
      {mctDocument ? (
        <React.Fragment>
          <FrontMatter {...mctDocument.meta} />
          <MctDocument components={mctDocument.components} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="no-file-selected">
            Please select a file...
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
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

export default Edit;
