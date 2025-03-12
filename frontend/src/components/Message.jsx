import React, { useEffect, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { useUserStore } from "../context/UserContext";
import GetSocketMessage from "./GetSocketMessage";

const Message = () => {
  const { selectedUser, messages } = useUserStore();
  const { user } = useAuth();
  const lastMsgRef = useRef(null);

  // GLOBAL CONTEXT
  GetSocketMessage();

  // Automatically scroll to the latest message
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Memoize messages to optimize re-renders
  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const senderId = message?.newMessage?.senderId || message?.senderId;

      const isCurrentUser = senderId === user?.user?._id;

      const profileImage = isCurrentUser
        ? user?.user?.profileImage
        : selectedUser?.profileImage;

      const messageText = message?.message || message?.newMessage?.message;
      const messageImage = message?.image || message?.newMessage?.image;

      const messageTimestamp =
        message?.createdAt || message?.newMessage?.createdAt;

      return (
        <div
          key={index}
          className={`chat ${isCurrentUser ? "chat-end" : "chat-start"} z-10`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={profileImage}
                alt={isCurrentUser ? "Your Profile" : "User Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="chat-header">
            {isCurrentUser ? "You" : selectedUser?.name}
            <time className="text-xs opacity-50 ml-2">
              {formatTimestamp(messageTimestamp)}
            </time>
          </div>
          <div className="chat-bubble flex flex-col">
            {messageImage && (
              <img src={messageImage} alt="Attachment" className="w-auto h-30 p-0" />
            )}
            {messageImage && <div className="chat-bubble p-0">{messageText}</div>}
          </div>
          {!messageImage && <div className="chat-bubble">{messageText}</div>}
          <div className="chat-footer opacity-50">
            {isCurrentUser ? "Delivered" : "Seen"}
          </div>
        </div>
      );
    });
  }, [messages, selectedUser, user]);

  return (
    <div className="p-4 sm:p-10 mt-15 h-full">
      <div className="overflow-y-auto h-full">
        {renderedMessages}
        <div ref={lastMsgRef} /> {/* Invisible element for scrolling */}
      </div>
    </div>
  );
};

export default React.memo(Message);
