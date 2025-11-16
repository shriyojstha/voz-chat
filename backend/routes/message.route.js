import express from "express";
import {upload, uploaderMedia} from "../controllers/upload.controller.js";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", authCheck, getUsers);
messageRouter.get("/:id", authCheck, getMessages);
messageRouter.post("/send/:id", authCheck, sendMessage);
messageRouter.post("/uploads", upload.single("file"), uploaderMedia);

export default messageRouter;




