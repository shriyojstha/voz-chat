import { create } from "zustand";
import { axiosI } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
export const useMessageStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageloading: false,

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosI.get("/message/users");
      set({ users: res.data.otherUsers });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageloading: true });
    try {
      const res = await axiosI.get(`/message/${userId}`);
      set({ messages: res.data.message });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageloading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosI.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      console.error("Send message error:", error); // always log full error
      const message =
        error?.response?.data?.message || // server-provided message
        error?.message || // fallback from Axios
        "Failed to send message"; // default
      toast.error(message);
    }
  },

  subscribeToMsg: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (data) => {
      if(data.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, data],
      });
    });
  },

  unSubscribeToMsg: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
