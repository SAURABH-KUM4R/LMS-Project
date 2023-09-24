import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState("");

    const [signupData, setsignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""
    });
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] p-10px">
                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>
                    <label htmlFor="image_upload" className="cursor-pointer">
                        {previewImage ? (
                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage}/>
                        ) : (
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                        )}
                    </label>
                    <input className="hidden" type="file" id="image_upload" accept=".jpg, .jpeg, .png, .svg"/>

                    <label htmlFor="name" className="font-semibold">Name</label>
                    <input type="text" className="p-1 rounded" id="name" placeholder="Name"/>

                    <label htmlFor="email" className="font-semibold">Email</label>
                    <input type="text" className="px-2 py-1 rounded" id="email" placeholder="Email" name="email"/>
                    
                    <label htmlFor="password" className="font-semibold">Password</label>
                    <input type="password" className="p-1 rounded" id="password" placeholder="Password"/>
                    <button className="bg-yellow-500 w-[10rem] rounded-full p-2 m-auto my-2 hover:bg-yellow-600  duration-500 text-lg cursor-pointer transition-all ease-in-out ">Create Account</button>
                    <p className="text-center">
                        Already have an account ? <Link to="/login" className="text-lg font-semibold text-yellow-500 hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Signup;