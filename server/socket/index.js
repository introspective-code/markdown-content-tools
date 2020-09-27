import { watchFile, readFileSync } from "fs";
import { getDocument, getSplitDocument } from "../services/document";

const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

export const connectRealtimeServices = ({ io, socket }) => {
  console.log(`[ server/socket ] Client: ${socket.id} connected.`);

  socket.emit("update-document", getDocument());
};

export const initializeRealtimeServices = ({ io }) => {
  io.emit("update-document", getDocument());

  watchFile(DOCUMENT_PATH, async (curr, prev) => {
    try {
      io.emit("update-document", getDocument());
    } catch (err) {
      console.log(err.message);
    }
  });

  console.log(JSON.stringify(getSplitDocument()));
};
