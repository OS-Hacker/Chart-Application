import React, { useEffect, useRef, useMemo, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useUserStore } from "../context/UserContext";
import GetSocketMessage from "./GetSocketMessage";

const Message = () => {
  const { selectedUser, messages, deleteMessage } = useUserStore();
  const { user } = useAuth();
  const lastMsgRef = useRef(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  // GLOBAL CONTEXT
  GetSocketMessage();

  // Close delete menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDeleteMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Handle message deletion
  const handleDeleteMessage = (messageId, deleteForEveryone = false) => {
    console.log(messageId)
    deleteMessage(messageId, deleteForEveryone);
    setShowDeleteMenu(null);
  };

  // Handle context menu
  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    setClickPosition({ x: e.clientX, y: e.clientY });
    setShowDeleteMenu(messageId);
  };

  // Memoize messages to optimize re-renders
  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const baseMessage = message.newMessage || message;
      const {
        _id: messageId,
        senderId,
        message: messageText,
        image: messageImage,
        createdAt: messageTimestamp,
        deleted: isDeleted,
        deletedForEveryone,
      } = baseMessage;

      const isCurrentUser = senderId === user?.user?._id;
      const profileImage = isCurrentUser
        ? user?.user?.profileImage
        : selectedUser?.profileImage;

      return (
        <div
          key={`${messageId}-${index}`}
          className={`chat ${
            isCurrentUser ? "chat-end" : "chat-start"
          } relative`}
          onContextMenu={(e) => handleContextMenu(e, messageId)}
        >
          {/* Profile Image */}
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={profileImage}
                alt={isCurrentUser ? "Your Profile" : "User Profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
          </div>

          {/* Message Content */}
          <div
            className={`chat-bubble flex flex-col p-1 text-sm break-words whitespace-pre-wrap ${
              isCurrentUser
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content"
            } ${isDeleted ? "opacity-70" : ""}`}
          >
            {isDeleted ? (
              <DeletedMessageIndicator />
            ) : (
              <>
                {messageImage && (
                  <ImageMessage
                    imageUrl={messageImage}
                    isCurrentUser={isCurrentUser}
                  />
                )}
                {messageText && (
                  <TextMessage
                    text={messageText}
                    hasImage={!!messageImage}
                    isCurrentUser={isCurrentUser}
                  />
                )}
              </>
            )}
          </div>

          {/* Message Status Footer */}
          <div className="chat-footer opacity-50 text-xs flex items-center gap-1 mt-1">
            {isCurrentUser && !isDeleted && <span>✓✓</span>}
            <time>{formatTimestamp(messageTimestamp)}</time>
          </div>

          {/* Delete Menu */}
          {showDeleteMenu === messageId && !isDeleted && (
            <DeleteMenu
              ref={menuRef}
              position={clickPosition}
              isCurrentUser={isCurrentUser}
              onDeleteForMe={() => handleDeleteMessage(messageId, false)}
              onDeleteForEveryone={() => handleDeleteMessage(messageId, true)}
            />
          )}
        </div>
      );
    });
  }, [messages, selectedUser, user, showDeleteMenu, clickPosition]);

  return (
    <div className="p-4 sm:p-10 mt-12 h-full">
      <div className="overflow-y-auto h-full">
        {renderedMessages}
        <div ref={lastMsgRef} />
      </div>
    </div>
  );
};

// Sub-components for better organization
const DeletedMessageIndicator = () => (
  <div className="italic text-gray-500 flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
    This message was deleted
  </div>
);

const ImageMessage = ({ imageUrl, isCurrentUser }) => (
  <div className="relative">
    <img
      src={imageUrl}
      alt="Attachment"
      className={`w-full max-w-[300px] h-auto max-h-[300px] object-cover ${
        isCurrentUser ? "rounded-l-lg" : "rounded-r-lg"
      }`}
      loading="lazy"
      onError={(e) => {
        e.target.src =
          "https://via.placeholder.com/300x300?text=Image+Not+Found";
      }}
    />
    <DownloadButton url={imageUrl} />
  </div>
);

const DownloadButton = ({ url }) => (
  <a
    href={url}
    download
    className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
    title="Download image"
    onClick={(e) => e.stopPropagation()}
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
);

const TextMessage = ({ text, hasImage, isCurrentUser }) => (
  <div
    className={`p-2 text-sm whitespace-pre-wrap break-words ${
      hasImage ? "rounded-b-lg max-w-[300px]" : "rounded-lg"
    } ${isCurrentUser ? "bg-primary/90" : "bg-base-200"}`}
  >
    {text.split(/( |\n)/).map((segment, i) => {
      // URL Detection
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
          <span key={i} className="inline-block text-2xl leading-relaxed">
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
);

const DeleteMenu = React.forwardRef(
  ({ position, isCurrentUser, onDeleteForMe, onDeleteForEveryone }, ref) => {
    const menuStyle = {
      position: "fixed",
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: "translate(-100%, 0)",
    };

    return (
      <div
        ref={ref}
        className="w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        style={menuStyle}
      >
        <div className="py-1">
          {isCurrentUser ? (
            <>
              <MenuItem onClick={onDeleteForMe}>Delete for me</MenuItem>
              <MenuItem onClick={onDeleteForEveryone}>
                Delete for everyone
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={onDeleteForMe}>Delete for me</MenuItem>
          )}
        </div>
      </div>
    );
  }
);

const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
  >
    {children}
  </button>
);

export default React.memo(Message);
