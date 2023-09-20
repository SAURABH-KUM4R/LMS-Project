import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
} from "../controllers/user.controller.js";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .post("/register", upload.single("avtar"), register)
  .post("change-password", isLoggedin, changePassword)
  .post("/login", login)
  .post("/forgot/password", forgotPassword)
  .post("/reset/:reset", resetPassword);

router.get("/logout", logout).get("/profile", isLoggedin, getProfile);
router.put("/update", isLoggedin, upload.single("avtar"), updateUser);
export default router;
