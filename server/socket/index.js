import { watch, readFileSync } from "fs";
import { getMctDocument } from "../services/document";
import {
  listFilesInDocumentsPath,
  openWithEditor,
  createAndOpenWithEditor,
  saveImageAndGetPath
} from "../utils/helpers";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
let lastEditedFile;

export const connectRealtimeServices = ({ io, socket }) => {
  if (lastEditedFile) {
    socket.emit("update-document", getMctDocument(lastEditedFile));
  }

  socket.on("list-files", () => {
    socket.emit("list-files", { files: listFilesInDocumentsPath() });
  });

  socket.on("edit-file", ({ file }) => {
    openWithEditor(file);
    const path = `${process.env.DOCUMENTS_PATH}/${file}`;
    socket.emit("update-document", getMctDocument(path));
  });

  socket.on("create-file", ({ file, template = 'coding' }) => {
    createAndOpenWithEditor({ file, template });
    const path = `${process.env.DOCUMENTS_PATH}/${file}.md`;
    socket.emit("update-document", getMctDocument(path));
  });

  socket.on("paste-image", ({ data, title }) => {
    socket.emit("image-url", { path: saveImageAndGetPath({ data, title }) });
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
