import Course from "../models/course.modle.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async function (req, res, next) {
  try {
    const courses = await Course.find({}).select("-lectures");
    res.status(200).json({
      sucess: true,
      message: "All courses",
      courses,
    });
  } catch (e) {
    return next(new AppError("Course not Found", 400));
  }
};

const getLecturesByCourseId = async function (req, res, next) {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError("Incorrect id Enter Valid One", 400));
    }
    res.status(200).json({
      sucess: true,
      message: "Course lectures fetched sucessfully",
      lectures: course.lectures,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const createCourse = async function (req, res, next) {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "dummy",
      secure_url: "dummy",
    },
  });

  if (!course) {
    return next(new AppError("Course is not created please try again", 500));
  }
  try {
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    }
  } catch (e) {
    return next(new AppError(e.message, 500));
  }

  course.save();

  res.status(200).json({
    sucess: true,
    message: "Course Created Sucessfully",
    course,
  });
};

const updateCourse = async function (req, res, next) {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );
    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    res.status(200).json({
      sucess: true,
      message: "The Course Updated sucessfully!!",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const removeCourse = async function (req, res, next) {
  try {
    const { id } = req.params;
    if (!(await Course.findById(id))) {
      return next(new AppError("course with given id does not exist", 500));
    }
    await Course.findByIdAndDelete(id);
    res.status(200).json({
      sucess: true,
      message: "Course removed sucessfully!!",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const addLectureToCourseById = async function (req, res, next) {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError("Course not found!!", 400));
  }

  const lectureData = {
    title,
    description,
    lecture: {},
  };

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      return next(new AppError(e.message, 500));
    }
  }
  course.lectures.push(lectureData);
  course.numberOfLectures = course.lectures.length;

  await course.save();

  res.status(200).json({
    sucess: true,
    message: "Lecture Added Sucessfully!!",
    course,
  });
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
};
