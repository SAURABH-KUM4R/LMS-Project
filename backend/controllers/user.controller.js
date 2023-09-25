import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import cloudnary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};
const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("Email Already Exists", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "#",
    },
  });

  if (!user) {
    return next(new AppError("Registration failed try again!!", 500));
  }

  //Todo: File upload
  if (req.file) {
    console.log(req.file);
    try {
      const result = cloudnary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = (await result).public_id;
        user.avatar.secure_url = (await result).secure_url;

        // remove file
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      return next(
        new AppError("File not uploaded, please try again", 500)
      );
    }
  }

  await user.save();

  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    sucess: true,
    message: "User Registered sucessfully",
    user,
  });
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required!!", 400));
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password not match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      sucess: true,
      message: "User loggedin sucessfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(400).json({
    sucess: true,
    message: "User logged out Sucessfully",
  });
};
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      sucess: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Failed to fetch profile", 404));
  }
};


const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email field is required!!", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User Not found", 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();
  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  console.log(resetPasswordURL);
  const subject = "Reset Password";
  const message = `To reset click here: ${resetPasswordURL}`;
  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      sucess: true,
      message: `Reset password token has been sent to ${email} sucessfully`,
    });
  } catch (e) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    console.log("Complete!!");
    return next(new AppError(e.message, 500));
  }
};
const resetPassword = async (req, res, next) => {
  const resetToken = req.params.reset;
  const { password } = req.body;
  console.log(resetToken);

  const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  console.log("Done!!");
  
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // Greater than todays date if answer is no then token is expired.
  });
  console.log("Done!!");

  if (!user) {
    return next(new AppError("Token is expired try again", 400));
  }
  console.log("Done!!");

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  console.log("Done!!");

  user.save();
  res.status(200).json({
    sucess: true,
    message: "Password changed sucessfully!!",
  });
};
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  if (newPassword == oldPassword || !newPassword || !oldPassword) {
    return next(
      new AppError("New password can't be similar to old password", 400)
    );
  }
  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new AppError("User does not exist", 400));
  }
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    return next(new AppError("Invalid old Password", 400));
  }
  user.password = newPassword;
  await user.save();

  user.password = undefined;
  res.status(200).json({
    sucess: true,
    message: "Password Changed sucessfully",
  });
};


const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not Found", 400));
  }

  if (req.fullName) {
    user.fullName = fullName;
  }

  if (req.file) {
    await cloudnary.v2.uploader.destroy(user.avtar.public_id);
    try {
      const result = cloudnary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avtar.public_id = (await result).public_id;
        user.avtar.secure_url = (await result).secure_url;

        // remove file
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      return next(
        new AppError(e || "File not uploaded, please try again", 500)
      );
    }
  }

  await user.save();

  res.status(200).json({
    sucess: true,
    message: "User updated sucessfully!!",
  });
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
