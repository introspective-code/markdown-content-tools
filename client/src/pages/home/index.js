import React, { useState } from "react";
import { Event } from "react-socket-io";
import "github-markdown-css/github-markdown.css";
import "./index.css";

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
      <div className="meta">{JSON.stringify(meta)}</div>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: post }}
      ></div>
      <Event event="update-document" handler={handleUpdatePost} />
    </React.Fragment>
  );
};

export default Home;
