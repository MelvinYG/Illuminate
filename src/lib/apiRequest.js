import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://illuminate-backend.onrender.com/api/",
    withCredentials: true
});

export default apiRequest;