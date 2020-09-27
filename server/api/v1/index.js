import express from "express";
// import axios from "axios";

const api = express.Router();

export default {
  use: (io) => {
    api.get("/", (req, res) => {
      res.status(200).send("OK");
    });

    return api;
  },
};
