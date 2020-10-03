import { watch, readFileSync } from "fs";
import { getMctDocument } from "../services/document";
import { listFilesInDocumentsPath, openWithEditor } from "../utils/helpers";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
let lastEditedFile;

export const connectRealtimeServices = ({ io, socket }) => {
  console.log(`[ server/socket ] Client: ${socket.id} connected.`);

  if (lastEditedFile) {
    socket.emit("update-document", getMctDocument(lastEditedFile));
  }

  socket.on("list-files", () => {
    console.log(`[ server/socket ] >>> list-files <<<.`);
    socket.emit("list-files", { files: listFilesInDocumentsPath() });
  });

  socket.on("edit-file", ({ file }) => {
    console.log(`[ server/socket ] >>> edit-file <<< : ${file}`);
    openWithEditor(file);
    const path = `${process.env.DOCUMENTS_PATH}/${file}`;
    socket.emit("update-document", getMctDocument(path));
  });
};

export const initializeRealtimeServices = ({ io }) => {
  watch(DOCUMENTS_PATH, async (eventType, filename) => {
    try {
      const path = `${DOCUMENTS_PATH}/${filename}`;
      lastEditedFile = path;
      io.emit("update-document", getMctDocument(path));
    } catch (err) {
      console.log(err.message);
    }
  });
};
