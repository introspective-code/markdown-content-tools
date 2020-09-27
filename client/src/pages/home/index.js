import React, { useState } from "react";
import _ from "lodash";
import { Event } from "react-socket-io";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";

const Home = () => {
  const [post, setPost] = useState("");
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    date: "",
    tags: [],
  });

  const handleUpdatePost = ({ markup, title, description, date, tags }) => {
    setPost(markup);
    setMeta({
      title,
      description,
      date,
      tags,
    });
  };

  return (
    <React.Fragment>
      <FrontMatter {...meta} />
      <Markdown post={post} />
      <Event event="update-document" handler={handleUpdatePost} />
    </React.Fragment>
  );
};

const FrontMatter = ({ title, description, date, tags }) => {
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

const Markdown = ({ post }) => {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: post }}
    ></div>
  );
};

export default Home;
