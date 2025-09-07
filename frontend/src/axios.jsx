import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // ✅ allow cookies (JSESSIONID) to be sent
});

export default API;
