import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createAccount } from "../Redux/Sclices/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");

  const [signupData, setsignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setsignupData({ ...signupData, [name]: value });
  }

  function getImage(event) {
    event.preventDefault();
    // getting the image
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setsignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.fullName ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.fullName.length < 5) {
      toast.error("Name is too short!!");
      return;
    }

    if (
      !signupData.email.match(
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
      )
    ) {
      toast.error("Invalid email ID");
      return;
    }

    if (
      !signupData.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
      )
    ) {
      toast.error("Weak Password!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email",signupData.email);
    formData.append("password",signupData.password);
    formData.append("avatar",signupData.avatar);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
    if (response?.payload?.sucess) {
      navigate("/");
    }

    setsignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: ""
    });
    setPreviewImage("");
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <form
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] p-10px"
          noValidate
          onSubmit={createNewAccount}
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>
          <label htmlFor="image_upload" className="cursor-pointer">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={getImage}
            className="hidden"
            type="file"
            id="image_upload"
            accept=".jpg, .jpeg, .png, .svg"
          />

          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            className="px-2 py-1 rounded"
            id="name"
            placeholder="Name"
            name="fullName"
            onChange={handleUserInput}
            value={signupData.fullName}
          />

          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="text"
            className="px-2 py-1 rounded"
            id="email"
            placeholder="Email"
            name="email"
            onChange={handleUserInput}
            value={signupData.email}
          />

          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input
            type="text"
            className="p-1 rounded"
            id="password"
            placeholder="Password"
            name="password"
            onChange={handleUserInput}
            value={signupData.password}
          />

          <button className="bg-yellow-500 w-[10rem] rounded-full p-2 m-auto my-2 hover:bg-yellow-600  duration-500 text-lg cursor-pointer transition-all ease-in-out ">
            Create Account
          </button>

          <p className="text-center">
            Already have an account ?{" "}
            <Link
              to="/login"
              className="text-lg font-semibold text-yellow-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
