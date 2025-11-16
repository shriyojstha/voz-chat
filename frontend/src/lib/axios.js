import axios from "axios";

export const axiosI = axios.create({
  baseURL: "https://voz-chat-production-dfe4.up.railway.app/api",
  withCredentials: true,
});
