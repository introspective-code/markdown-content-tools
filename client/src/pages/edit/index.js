import React, { useContext, useEffect, useState, useRef } from "react";
import _ from "lodash";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import moment from "moment";
import { Event, SocketContext } from "react-socket-io";
import { MainContext } from "../../context/main";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";

const UPLOAD_URL = "/api/v1/upload";
const FIVE_MEGABYTES = 5 * 1024 * 1024;

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
      {mctDocument && <MediaUploader title={mctDocument.meta.title} />}
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

const MediaUploader = ({ title }) => {
  const socket = useContext(SocketContext);
  const [inputValue, setInputValue] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [placeholder, setPlaceholder] = useState("Paste media here.");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaceholder('Drop file here.');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaceholder('Paste media here.');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.items) {
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === "file") {
          const file = event.dataTransfer.items[i].getAsFile();
          handleSelectedFile(file);
          break;
        }
      }
    } else {
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        handleSelectedFile(file);
        break;
      }
    }
  };

  const handleSelectedFile = (file) => {
    if (file.size > FIVE_MEGABYTES) {
      setPlaceholder("File size cannot exceed more than 5MB");
    } else {
      handleSelectedFileSuccess(file);
    }
  }

  const handleSelectedFileSuccess = async (file) => {
    setPlaceholder("Uploading file to CDN...");

    const formData = new FormData();

    const name = `${_.kebabCase(title)}-${new Date()}`;

    formData.append("name", name);
    formData.append("file", file);

    try {
      await axios.put(UPLOAD_URL, formData);
    } catch (err) {
      console.log(err);
    }

    setPlaceholder("Paste media here.");
  }

  return (
    <div className={"image-uploader"}>
      <FileUploader
        onFileSelectSuccess={(file) => handleSelectedFileSuccess(file)}
        onFileSelectError={({ error }) => setPlaceholder(error)}
      />
      <input
        className={"image-paste-field"}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        type="text"
        placeholder={placeholder}
        defaultValue={inputValue}
      />
      <CopyToClipboard text={inputValue} onCopy={handleCopy}>
        <div className={"copy-clipboard-btn"}>
          {isCopied ? "Copied." : "Copy To Clipboard."}
        </div>
      </CopyToClipboard>
      <Event event="media-url" handler={handleImageUrl} />
    </div>
  );
}

const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
  const fileInput = useRef(null);

  const handleFileInput = event => {
    const file = event.target.files[0];

    if (file.size > FIVE_MEGABYTES) {
      onFileSelectError({ error: "File size cannot exceed more than 5MB"});
    } else {
      onFileSelectSuccess(file);
    }
  }

  return (
    <div className={"file-uploader"}>
      <input
        ref={fileInput}
        onChange={handleFileInput}
        className={"file-input-field"}
        type="file"
      />
      <div
        className={"file-upload-btn"}
        onClick={(e) => fileInput.current && fileInput.current.click()}
      >
        Upload Media
      </div>
    </div>
  );
}

export default Edit;
