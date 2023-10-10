import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/Homepage";
import AboutUs from "./Pages/AboutUs";
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/SingUp";
import Login from "./Pages/Login";
import CourseList from "./Pages/Course/CourseList";
import Contact from "./Pages/ContactUs";
import Denied from "./Pages/Denied";
import CourseDescription from "./Pages/Course/CourseDescription";
import RequireAuth from "./Component/Auth/RequireAuth";
import CreateCourse from "./Pages/Course/CreateCourse";
import Profile from "./Pages/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/courses" element={<CourseList />}></Route>
        <Route path="/courses/description" element={<CourseDescription/>}></Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
          <Route path="/courses/create" element={<CreateCourse/>}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]}/>}>
          <Route path="/user/profile" element={<Profile/>}></Route>
        </Route>

        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/denied" element={<Denied/>}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
