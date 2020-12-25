import express from "express";
const api = express.Router();
import { moveUploadedFile, uploadMediaAndUnlink } from "../../utils/helpers";
import { TEMP_PATH } from "../../utils/constants";

export default {
  use: (io) => {
    api.get("/", (req, res) => {
      res.status(200).send("OK");
    });

    api.put("/upload", async (req, res, next) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      let file = req.files.file;

      try {
        const { path } = await moveUploadedFile({ file });
        const { secureUrl } = await uploadMediaAndUnlink({ path });
        console.log(`[ server/api/v1/index.js' ] Uploading file ${file.name}`)
        io.emit("media-url", { path: `![](${secureUrl})` });
        res.json({ secureUrl });
      } catch(err) {
        io.emit("media-url", { path: err.message });
        next(err);
      }
    });

    return api;
  },
};
