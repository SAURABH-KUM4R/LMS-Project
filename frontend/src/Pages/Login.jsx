import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { login } from "../Redux/Sclices/AuthSlice.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setloginData] = useState({
    email: "",
    password: ""
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
  }

  async function dologin(event) {
    event.preventDefault();
    if (
      !loginData.email ||
      !loginData.password
    ) {
      toast.error("Please fill all the details");
      return;
    }

    // dispatch create account action
    const response = await dispatch(login(loginData));
    if (response?.payload?.sucess) {
        toast.success("Logedin sucessfully!!")
        navigate("/");
    }

    setloginData({
      email: "",
      password: ""
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <form
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] p-10px"
          noValidate
          onSubmit={dologin}
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>

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
            value={loginData.email}
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
            value={loginData.password}
          />

          <button className="bg-yellow-500 w-[10rem] rounded-full p-2 m-auto my-2 hover:bg-yellow-600  duration-500 text-lg cursor-pointer transition-all ease-in-out ">
            Log In
          </button>

          <p className="text-center">
            Do not have account ?{" "}
            <Link
              to="/signup"
              className="text-lg font-semibold text-yellow-500 hover:underline"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
