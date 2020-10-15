import React, { useState, useEffect, useContext } from "react";
import { Event, SocketContext } from "react-socket-io";
import "./index.css";

const Export = () => {
  const socket = useContext(SocketContext);

  useEffect(() => {}, []);

  return <React.Fragment>[EXPORT]</React.Fragment>;
};

export default Export;
