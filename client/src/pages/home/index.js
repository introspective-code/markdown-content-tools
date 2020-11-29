import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Event, SocketContext } from "react-socket-io";
import "github-markdown-css/github-markdown.css";
import "./index.css";
import { MainContext } from "../../context/main";

const Home = () => {
  const [isValidFilename, setIsValidFilename] = useState(true);
  const history = useHistory();

  const socket = useContext(SocketContext);
  const { state } = useContext(MainContext);
  const { files } = state;

  useEffect(() => {
    socket.emit("list-files");
  }, []);

  const handleUpdateMctDocument = () => {
    history.push("/edit");
  };

  const handleClickFile = (file) => {
    socket.emit("edit-file", { file });
  };

  const handleClickCreate = (file) => {
    if (file !== "") {
      setIsValidFilename(true);
      socket.emit("create-file", { file });
    } else {
      setIsValidFilename(false);
    }
  };

  return (
    <React.Fragment>
      <div className="edit-container">
        <div className="edit-box">
          <NewFile
            handleClick={handleClickCreate}
            valid={isValidFilename}
          />
        </div>
        <div className="edit-box">
          <ListedFiles files={files} handleClick={handleClickFile} />
        </div>
      </div>
      <Event event="update-document" handler={handleUpdateMctDocument} />
    </React.Fragment>
  );
};

const ListedFiles = ({ files, handleClick }) => {
  return (
    <React.Fragment>
      <div className="edit-title">Edit Existing Files</div>
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

const NewFile = ({ handleClick, valid }) => {
  const [newFileName, setNewFileName] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    const newValue = value
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9 \-_\.]/g, "")
      .toLowerCase();
    setNewFileName(newValue);
  };

  const handleCreateNewFile = () => {
    handleClick(newFileName);
  };

  return (
    <React.Fragment>
      <div className="edit-title">Create New File</div>
      <div className="new-file-options">
        <input
          onChange={(event) => handleChange(event)}
          className={`new-file-input ${valid ? "" : "invalid-file-name"}`}
          placeholder="Enter file name"
          value={newFileName}
        />
        <div className="new-file-format">.md</div>
        <div onClick={handleCreateNewFile} className="new-file-create-btn">
          Create
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
