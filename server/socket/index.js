import { watchFile, readFileSync } from "fs";
import markdownIt from "markdown-it";
import markdownItHighlightJs from "markdown-it-highlightjs";
import { loadFront } from "yaml-front-matter";

const DOCUMENT_PATH = process.env.DOCUMENT_PATH || "devnotes.txt";

const converter = new markdownIt().use(markdownItHighlightJs);

export const connectRealtimeServices = ({ io, socket }) => {
  console.log(`[ server/socket ] Client: ${socket.id} connected.`);

  socket.emit("update-document", getDocument());
};

export const initializeRealtimeServices = ({ io }) => {
  io.emit("update-document-markup", {
    markup: readFileSync(DOCUMENT_PATH, "utf-8"),
  });

  watchFile(DOCUMENT_PATH, async (curr, prev) => {
    try {
      io.emit("update-document", getDocument());
    } catch (err) {
      console.log(err.message);
    }
  });
};

const getDocument = () => {
  try {
    const text = readFileSync(DOCUMENT_PATH, "utf-8");
    const { description, title, date, tags } = loadFront(text);
    const markdown = text.split("---\n")[2];
    const markup = converter.render(markdown);

    return {
      description,
      title,
      date,
      tags,
      markup,
    };
  } catch (err) {
    console.log(err.message);
  }
  return {};
};
