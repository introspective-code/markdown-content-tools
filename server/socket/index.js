import { watchFile, readFileSync } from "fs";
import { getDocument, getDocumentComponents } from "../services/document";

const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

export const connectRealtimeServices = ({ io, socket }) => {
  console.log(`[ server/socket ] Client: ${socket.id} connected.`);

  socket.emit("update-document", getDocument());
  socket.emit("update-document-components", getDocumentComponents());
};

export const initializeRealtimeServices = ({ io }) => {
  io.emit("update-document", getDocument());
  io.emit("update-document-components", getDocumentComponents());

  watchFile(DOCUMENT_PATH, async (curr, prev) => {
    try {
      io.emit("update-document", getDocument());
      io.emit("update-document-components", getDocumentComponents());
    } catch (err) {
      console.log(err.message);
    }
  });
};
