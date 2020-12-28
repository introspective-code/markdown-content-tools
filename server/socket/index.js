import { watch, readFileSync } from "fs";
import { getMctDocument } from "../services/document";
import {
  listFilesInDocumentsPath,
  openWithEditor,
  createAndOpenWithEditor,
  saveImageAndGetPath,
  saveAndGetExportedBlog,
  createAndGetMediumDraft,
  createAndGetJekyllBlog
} from "../utils/helpers";
import { TEMP_DIR } from "../utils/constants";

const DOCUMENTS_PATH = process.env.DOCUMENTS_PATH;
let lastEditedFile;

export const connectRealtimeServices = ({ io, socket }) => {
  if (lastEditedFile) {
    socket.emit("update-document", getMctDocument(lastEditedFile));
  }

  socket.on("open-file", ({ file }) => {
    openWithEditor(file);
  });

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

  socket.on("paste-image", async ({ data, title }) => {
    try {
      const path = await saveImageAndGetPath({ data, title });
      socket.emit("media-url", { path });
    } catch(err) {
      console.log(err);
      socket.emit("media-url", { path: err.message });
    }
  });

  socket.on("export-blog", ({ mctDocument }) => {
    const exportedBlog = saveAndGetExportedBlog({ mctDocument });
    socket.emit("update-exported-blog", { exportedBlog });
  });

  socket.on("publish-medium-draft", async ({ mctDocument }) => {
    const publishedDraft = await createAndGetMediumDraft({ mctDocument });
    socket.emit("update-published-medium-draft", { publishedDraft });
  });

  socket.on("publish-jekyll-blog", async ({ mctDocument }) => {
    const publishedBlog = await createAndGetJekyllBlog({ mctDocument });
    socket.emit("update-published-jekyll-blog", { publishedBlog });
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
