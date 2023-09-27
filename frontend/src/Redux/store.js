import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Sclices/AuthSlice'
import CourseSliceReducer from "./Sclices/CourseSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: CourseSliceReducer
    },
    devTools: true
});

export default store