import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // selected only one user
  const [selectedUser, setSelectedUser] = useState(null);

  const { user } = useAuth();

  // handle massages
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);

  // delete message
  // ... existing state ...
  const deleteMessage = async (messageId, deleteForEveryone) => {
    try {
      // Call your API to delete the message
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/message/delete/${messageId}`,
        {
          data: { deleteForEveryone },
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Update local state
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId || msg.newMessage?._id === messageId
            ? { ...msg, deleted: true, deletedForEveryone }
            : msg
        ),
      }));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        users,
        setUsers,
        deleteMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);
