import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import socketIo from "socket.io";
import { connectRealtimeServices, initializeRealtimeServices } from "./socket";
import api from "./api/v1";
import { existsSync, mkdirSync } from "fs";
import regeneratorRuntime from "regenerator-runtime";
import fileUpload from "express-fileupload";
import cors from "cors";
import {
  TEMP_PATH,
  SOCKET_HEARTBEAT_TIMEOUT,
  SOCKET_HEARTBEAT_INTERVAL,
} from "./utils/constants";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
const EXPORTS_PATH = process.env.EXPORTS_PATH;

if (!existsSync(DOCUMENTS_PATH)) {
  console.log(`[ server ] Creating documents path at ${DOCUMENTS_PATH}`);
  mkdirSync(DOCUMENTS_PATH);
}

if (!existsSync(EXPORTS_PATH)) {
  console.log(`[ server ] Creating exports path at ${EXPORTS_PATH}`);
  mkdirSync(EXPORTS_PATH);
}

if (!existsSync(TEMP_PATH)) {
  console.log(`[ server ] Creating temp path at ${TEMP_PATH}`);
  mkdirSync(`${TEMP_PATH}`);
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

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "client/build")));
app.use("/api/v1", api.use(io));

app.get('/', (req, res) => {
  res.status(200).send('OK');
});
