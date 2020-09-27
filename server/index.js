import { watchFile, readFileSync } from "fs";
import express from "express";
import http from "http";
import path from "path";
import socketIo from "socket.io";
import { connectRealtimeServices } from "./socket";
import api from "./api/v1";

const DOCUMENT_PATH = process.env.DOCUMENT_PATH || "devnotes.txt";
const SOCKET_HEARTBEAT_TIMEOUT = 4000;
const SOCKET_HEARTBEAT_INTERVAL = 2000;

watchFile(DOCUMENT_PATH, async (curr, prev) => {
  try {
    const file = readFileSync(DOCUMENT_PATH, "utf-8");
  } catch (err) {
    console.log(err.message);
  }
});

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "client/build")));
app.use("/api/v1", api.use(io));
