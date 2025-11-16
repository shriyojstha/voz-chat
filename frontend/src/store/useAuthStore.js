import { create } from "zustand";
import { axiosI } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import {io} from 'socket.io-client';


const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : '/';


export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isLoading: true, //checking auth
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingPfp: false,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosI.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosI.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account Created successfully");
    } catch (error) {
      console.error("Error in signup: ", error);
      toast.error(error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosI.post("auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosI.post("/auth/login", data);
      set({ authUser: res.data.User });
      get().connectSocket();
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in login: ", error);
    } finally {
      set({ isLogginIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingPfp: true });
    try {
      const res = await axiosI.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Uploaded Successfully");
    } catch (error) {
      console.log("Error in upload profile: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingPfp: false });
    }
  },

  connectSocket: () => {

    const {authUser} = get();

    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query:{
        userId: authUser._id
      }
    });
    socket.connect();
    set({socket: socket})

    socket.on('getOnlineUsers', (userIds) => {
      set({onlineUsers: userIds})
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
