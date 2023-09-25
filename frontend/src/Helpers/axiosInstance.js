import axios from "axios";

const BASE_URL = "http://127.0.0.1:5014/api/v1";

export const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;