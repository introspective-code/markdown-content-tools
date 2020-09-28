import { watch, readFileSync } from "fs";
import { getDocument, getDocumentComponents } from "../services/document";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
let lastEditedFile;

export const connectRealtimeServices = ({ io, socket }) => {
  console.log(`[ server/socket ] Client: ${socket.id} connected.`);

  if (lastEditedFile) {
    socket.emit("update-document", getDocument(lastEditedFile));
    socket.emit(
      "update-document-components",
      getDocumentComponents(lastEditedFile)
    );
  }
};

export const initializeRealtimeServices = ({ io }) => {
  watch(DOCUMENTS_PATH, async (eventType, filename) => {
    try {
      const path = `${DOCUMENTS_PATH}/${filename}`;
      lastEditedFile = path;
      io.emit("update-document", getDocument(path));
      io.emit("update-document-components", getDocumentComponents(path));
    } catch (err) {
      console.log(err.message);
    }
  });
};
