import {useEffect } from "react";
import { getAllCourses } from "../../Redux/Sclices/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { useSelector, useDispatch } from "react-redux";
import CourseCard from "../../Component/CourseCard";
//14:00
function CourseList() {
    const dispatch = useDispatch

    const { courseData } = useSelector((state) => state.course);

    async function loadCourse() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourse();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
                <h1>
                    Explore the courses made by
                    <span className="font-bold text-yellow-500">
                        &nbsp;Industry Experts
                    </span>
                    <div className="mb-10 flex flex-wrap gap-14">
                        {courseData?.map((element) => {
                            return <CourseCard key={element.id} data={element}/>
                        })}                        
                    </div>
                </h1>
            </div>
        </HomeLayout>
    )
}

export default CourseList;