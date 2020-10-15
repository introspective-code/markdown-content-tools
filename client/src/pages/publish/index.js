import React, { useState, useEffect, useContext } from "react";
import { Event, SocketContext } from "react-socket-io";
import "./index.css";

const Publish = () => {
  const socket = useContext(SocketContext);

  useEffect(() => {}, []);

  return <React.Fragment>[PUBLISH]</React.Fragment>;
};

export default Publish;
