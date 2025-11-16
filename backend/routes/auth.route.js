import express from "express";
import authController, {
  updateProfile,
} from "../controllers/auth.controller.js";
import { authCheck, checkAuth } from "../middleware/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/signup", authController.signUp);
authRoute.post("/login", authController.login);
authRoute.post("/logout", authController.logout);

authRoute.put("/update-profile", authCheck, updateProfile);

authRoute.get("/check", authCheck, checkAuth);

export default authRoute;
