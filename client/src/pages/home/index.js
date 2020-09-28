import React, { useState } from "react";
import _ from "lodash";
import { Event } from "react-socket-io";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";

const Home = () => {
  const [isSplitDocument, setIsSplitDocument] = useState(true);
  const [markdownSlide, setMarkdownSlide] = useState("");
  const [splitDocument, setSplitDocument] = useState("");
  const [meta, setMeta] = useState({
    path: "",
    title: "",
    description: "",
    date: "",
    tags: [],
  });

  const handleUpdateSinglePost = ({
    path,
    markup,
    title,
    description,
    date,
    tags,
  }) => {
    setMarkdownSlide(markup);
    setMeta({
      path,
      title,
      description,
      date,
      tags,
    });
  };

  const handleUpdateSplitDocument = ({
    path,
    components,
    title,
    description,
    date,
    tags,
  }) => {
    setSplitDocument(components);
    setMeta({
      path,
      title,
      description,
      date,
      tags,
    });
  };

  return (
    <React.Fragment>
      <FrontMatter {...meta} />
      {isSplitDocument ? (
        <SplitDocument components={splitDocument} />
      ) : (
        <MarkdownSlide content={markdownSlide} />
      )}
      <Event event="update-document" handler={handleUpdateSinglePost} />
      <Event
        event="update-document-components"
        handler={handleUpdateSplitDocument}
      />
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

const SplitDocument = ({ components }) => {
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

export default Home;
