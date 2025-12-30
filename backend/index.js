import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import storyRoute from "./routes/story.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/story", storyRoute);

app.get("/", (req, res) => {
  res.send("Adventure Flip Backend is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
