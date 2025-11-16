import React, { useEffect } from "react";
import { useMessageStore } from "../store/useMessageStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessage } from "../lib/utils";
import { useRef } from "react";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessageloading,
    selectedUser,
    subscribeToMsg,
    unSubscribeToMsg,
  } = useMessageStore();

  const endRef = useRef(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if ( messages) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMsg();

    return () => unSubscribeToMsg();
  }, [getMessages, selectedUser._id, subscribeToMsg, unSubscribeToMsg]);

  if (isMessageloading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1  overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={endRef}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "avatar.png"
                      : selectedUser.profilePic || "avatar.png"
                  }
                  alt="profile"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessage(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-[200px] rounded-md mb-2 "
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            {/* <div className="bg-red-500" ref={endRef} /> */}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
