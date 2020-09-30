import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import socketIo from "socket.io";
import { connectRealtimeServices, initializeRealtimeServices } from "./socket";
import api from "./api/v1";
import { existsSync, mkdirSync } from "fs";
import regeneratorRuntime from "regenerator-runtime";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
const EXPORTS_PATH = process.env.EXPORTS_PATH;
const SOCKET_HEARTBEAT_TIMEOUT = 4000;
const SOCKET_HEARTBEAT_INTERVAL = 2000;

if (!existsSync(DOCUMENTS_PATH)) {
  console.log(`[ server ] Creating documents path at ${DOCUMENTS_PATH}`);
  mkdirSync(DOCUMENTS_PATH);
}

if (!existsSync(EXPORTS_PATH)) {
  console.log(`[ server ] Creating exports path at ${EXPORTS_PATH}`);
  mkdirSync(EXPORTS_PATH);
}

const app = express();
const server = http.Server(app);
const io = socketIo(server);

io.set("heartbeat timeout", SOCKET_HEARTBEAT_TIMEOUT);
io.set("heartbeat interval", SOCKET_HEARTBEAT_INTERVAL);

server.listen(process.env.PORT || 8000, () => {
  console.log(
    `[ server ] Realtime & API server listening on port ${
      server.address().port
    }`
  );
});

io.on("connection", (socket) => connectRealtimeServices({ io, socket }));

initializeRealtimeServices({ io });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "client/build")));
app.use("/api/v1", api.use(io));
