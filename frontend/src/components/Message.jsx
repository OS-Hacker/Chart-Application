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

      console.log(message);

      return (
        <div
          key={index}
          className={`chat ${isCurrentUser ? "chat-end" : "chat-start"} z-10`}
        >
          {/* Profile Image */}
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={profileImage}
                alt={isCurrentUser ? "Your Profile" : "User Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Message Content */}
          <div className="chat-bubble flex flex-col p-1 bg-[your-bubble-color] text-sm break-words whitespace-pre-wrap">
            {/* Image Attachment */}
            {messageImage && (
              <div className="relative">
                <img
                  src={messageImage}
                  alt="Attachment"
                  className="w-full max-w-[300px]  h-auto max-h-[300px] object-cover rounded-t-lg"
                  loading="lazy"
                />
                {/* WhatsApp-style Download Button */}
                <a
                  href={messageImage}
                  download
                  className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
                  title="Download image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>
              </div>
            )}

            {/* Text Message */}
            {messageText && (
              <div
                className={`p-2 text-sm whitespace-pre-wrap break-words ${
                  messageImage ? "rounded-b-lg max-w-[300px]" : "rounded-lg "
                }`}
              >
                {messageText.split(/( |\n)/).map((segment, i) => {
                  // URL Detection (with preview if available)
                  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
                  const urlMatch = segment.match(urlRegex);

                  if (urlMatch) {
                    const url = urlMatch[0].startsWith("http")
                      ? urlMatch[0]
                      : `https://${urlMatch[0]}`;
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {urlMatch[0]}
                      </a>
                    );
                  }

                  // Pure Emoji Detection
                  const isPureEmoji = /^\p{Emoji}+$/u.test(segment.trim());
                  if (isPureEmoji) {
                    return (
                      <span
                        key={i}
                        className="inline-block leading-relaxed emoji p-0"
                      >
                        {segment}
                      </span>
                    );
                  }

                  // WhatsApp-style Formatting
                  if (segment.startsWith("*") && segment.endsWith("*")) {
                    return <strong key={i}>{segment.slice(1, -1)}</strong>;
                  }
                  if (segment.startsWith("_") && segment.endsWith("_")) {
                    return <em key={i}>{segment.slice(1, -1)}</em>;
                  }
                  if (segment.startsWith("~") && segment.endsWith("~")) {
                    return <del key={i}>{segment.slice(1, -1)}</del>;
                  }

                  // Newlines
                  if (segment === "\n") return <br key={i} />;

                  // Normal Text
                  return <span key={i}>{segment}</span>;
                })}
              </div>
            )}
          </div>

          {/* Message Status Footer */}
          <div className="chat-footer opacity-50 text-xs flex items-center gap-1 mt-1">
            {isCurrentUser ? (
              <>
                <span>✓✓</span>{" "}
                {/* Always show double check for sent messages */}
                <time className="ml-1">
                  {formatTimestamp(messageTimestamp)}
                </time>
              </>
            ) : (
              <time>{formatTimestamp(messageTimestamp)}</time>
            )}
          </div>
        </div>
      );
    });
  }, [messages, selectedUser, user]);

  return (
    <div className="p-4 sm:p-10 mt-12 h-full">
      <div className="overflow-y-auto h-full">
        {renderedMessages}
        <div ref={lastMsgRef} /> {/* Invisible element for scrolling */}
      </div>
    </div>
  );
};

export default React.memo(Message);
