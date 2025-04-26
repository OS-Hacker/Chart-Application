import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useUserStore } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import GetSocketMessage from "./GetSocketMessage";

// Sub-components
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

const TextMessage = ({ text, hasImage, isCurrentUser }) => {
  const renderTextSegment = (segment, i) => {
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

    const isPureEmoji = /^\p{Emoji}+$/u.test(segment.trim());
    if (isPureEmoji) {
      return (
        <span key={i} className="inline-block text-2xl leading-relaxed">
          {segment}
        </span>
      );
    }

    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <strong key={i}>{segment.slice(1, -1)}</strong>;
    }
    if (segment.startsWith("_") && segment.endsWith("_")) {
      return <em key={i}>{segment.slice(1, -1)}</em>;
    }
    if (segment.startsWith("~") && segment.endsWith("~")) {
      return <del key={i}>{segment.slice(1, -1)}</del>;
    }

    if (segment === "\n") return <br key={i} />;

    return <span key={i}>{segment}</span>;
  };

  return (
    <div
      className={`p-2 text-sm whitespace-pre-wrap break-words ${
        hasImage ? "rounded-b-lg max-w-[300px]" : "rounded-lg"
      } ${isCurrentUser ? "bg-primary/90" : "bg-base-200"}`}
    >
      {text.split(/( |\n)/).map(renderTextSegment)}
    </div>
  );
};

const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
  >
    {children}
  </button>
);

const DeleteMenu = React.forwardRef(
  (
    { position, isCurrentUser, onDeleteForMe, onDeleteForEveryone, onClose },
    ref
  ) => {
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
              <MenuItem
                onClick={() => {
                  onDeleteForMe();
                  onClose();
                }}
              >
                Delete for me
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteForEveryone();
                  onClose();
                }}
              >
                Delete for everyone
              </MenuItem>
            </>
          ) : (
            <MenuItem
              onClick={() => {
                onDeleteForMe();
                onClose();
              }}
            >
              Delete for me
            </MenuItem>
          )}
        </div>
      </div>
    );
  }
);

const Message = () => {
  const { selectedUser, messages, setMessages } = useUserStore();
  const { user } = useAuth();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const prevSelectedUserRef = useRef(selectedUser);
  const prevMessagesLengthRef = useRef(messages.length);

  // GLOBAL CONTEXT
  GetSocketMessage();

  // Handle real-time message updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === selectedUser?._id) {
        setMessages((prev) => [...prev, { newMessage }]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser?._id, setMessages]);

  // Handle message deletion events
  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = (deletedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => {
          const baseMsg = msg.newMessage || msg;
          return baseMsg._id !== deletedMessage._id;
        })
      );
      setShowDeleteMenu(null);
    };

    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, setMessages]);

  // Close delete menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDeleteMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom when needed
  // Update the auto-scroll useEffect to this:
  // Auto-scroll to bottom when needed
  // Auto-scroll to bottom when needed
  useEffect(() => {
    const scrollToBottom = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    };

    // Store current values before comparison
    const currentUserId = selectedUser?._id;
    const prevUserId = prevSelectedUserRef.current?._id;
    const currentMessagesLength = messages.length;
    const prevMessagesLength = prevMessagesLengthRef.current;

    // Check if user changed or new messages arrived
    const userChanged = currentUserId === prevUserId;
    const newMessagesArrived = currentMessagesLength > prevMessagesLength;

    if (userChanged || newMessagesArrived) {
      scrollToBottom();
    }

    // Update refs after comparison
    prevSelectedUserRef.current = selectedUser;
    prevMessagesLengthRef.current = messages.length;
  }, [messages, messages.length, selectedUser, selectedUser?._id]);

  const formatTimestamp = useCallback((timestamp) => {
    return timestamp
      ? new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  }, []);

  const handleContextMenu = useCallback((e, messageId) => {
    e.preventDefault();
    setClickPosition({ x: e.clientX, y: e.clientY });
    setShowDeleteMenu(messageId);
  }, []);

  const deleteMessage = useCallback(
    async (messageId, deleteForEveryone) => {
      try {
        if (!user?.token) throw new Error("Authentication required");
        if (!socket) throw new Error("Socket connection not available");

        // Optimistic update - remove the message immediately
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => {
            const baseMsg = msg.newMessage || msg;
            return baseMsg._id !== messageId;
          })
        );
        
        setShowDeleteMenu(null);

        // Send delete request to server
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/message/delete/${messageId}`,
          {
            data: { deleteForEveryone },
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        // Broadcast deletion to other users
        socket.emit("deleteMessage", {
          messageId,
          deleteForEveryone,
          conversationId: selectedUser?._id,
        });
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    },
    [user?.token, socket, selectedUser?._id, setMessages]
  );

  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const baseMessage = message.newMessage || message;

      const {
        _id: messageId,
        senderId,
        message: messageText,
        image: messageImage,
        createdAt: messageTimestamp,
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

          <div
            className={`chat-bubble flex flex-col p-1 text-sm break-words whitespace-pre-wrap ${
              isCurrentUser
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content"
            }`}
          >
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
          </div>

          <div className="chat-footer opacity-50 text-xs flex items-center gap-1 mt-1">
            {isCurrentUser && <span>✓✓</span>}
            <time>{formatTimestamp(messageTimestamp)}</time>
          </div>

          {showDeleteMenu === messageId && (
            <DeleteMenu
              ref={menuRef}
              position={clickPosition}
              isCurrentUser={isCurrentUser}
              onDeleteForMe={() => deleteMessage(messageId, false)}
              onDeleteForEveryone={() => deleteMessage(messageId, true)}
              onClose={() => setShowDeleteMenu(null)}
            />
          )}
        </div>
      );
    });
  }, [
    messages,
    selectedUser,
    user,
    showDeleteMenu,
    clickPosition,
    handleContextMenu,
    formatTimestamp,
    deleteMessage,
  ]);

  return (
    <div className="p-4 sm:p-10 mt-12 h-full">
      <div className="overflow-y-auto h-full">
        {renderedMessages}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default React.memo(Message);

