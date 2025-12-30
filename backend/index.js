import dotenv from "dotenv";
dotenv.config();
// console.log("ENV KEYS:", Object.keys(process.env));

import express from "express";
import cors from "cors";
import storyRoute from "./routes/story.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/story", storyRoute);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
