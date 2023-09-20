import { Router } from "express";
import {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { authRoles, authSubscriber, isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .get("/", getAllCourses)
  .post("/",isLoggedin,authRoles('ADMIN'), upload.single("thumbnail"), createCourse);

router
  .get("/:id",isLoggedin,authSubscriber,getLecturesByCourseId)
  .put("/:id",isLoggedin,authRoles('ADMIN'),updateCourse)
  .delete("/:id",isLoggedin,authRoles('ADMIN'),removeCourse)
  .post("/:id",isLoggedin,authRoles('ADMIN'),upload.single("lecture"),addLectureToCourseById);

export default router;