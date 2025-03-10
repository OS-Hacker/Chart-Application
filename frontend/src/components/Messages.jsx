import { useEffect, useState } from "react";
import Message from "./Message";
import { useUserStore } from "../context/UserContext";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import Loading from "./Loading";


const Messages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const { selectedUser, messages, setMessages } = useUserStore(); // Get messages and selected user from context
  const { user } = useAuth(); // Get current user from auth context

  // Fetch messages for the selected user
  const getMessage = async () => {
    if (!selectedUser?._id || !user?.token) return; // Early return if no selected user or token

    setLoading(true);
    setError(null); // Reset error state before making the request

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/message/get/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token in the request
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessages(response.data); // Set the messages from response.data
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when selectedUser or token changes
  useEffect(() => {
    getMessage();
  }, [selectedUser, user?.token]);

  // Render loading, error, or messages
  return (
    <div style={{ maxHeight: "calc(93vh)", overflowY: "auto" }} className="">
      {loading ? (
        <Loading /> // Show loading spinner
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div> // Show error message
      ) : messages?.length > 0 ? (
        <Message /> // Render messages
      ) : (
        <div className="text-center p-4 text-gray-500 mt-96">
          No messages yet. Start a conversation!
        </div> // Show empty state
      )}
    </div>
  );
};

export default Messages;
