import axios from "axios";
import authToken from "./service/auth_token";


const token = "Bearer " + authToken();
const refreshTokenName = "refresh_token";
const BASE_URL = import.meta.env.VITE_API_MODE === 'development' ? 
                  import.meta.env.VITE_API_LOCAL_BACKEND_URL : 
                  import.meta.env.VITE_API_SERVER_BACKEND_URL 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
const axiosInstancePrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token,
  },
});

export { BASE_URL, axiosInstance, axiosInstancePrivate, refreshTokenName };
