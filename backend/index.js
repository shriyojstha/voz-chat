import express from "express";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoute);
app.use("/api/message", messageRouter);




mongoose
  .connect(MONGODB_URI)
  .then(
    server.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    })
  )
  .catch((err) => {
    console.error("Error conencting to database: ", err);
  });
