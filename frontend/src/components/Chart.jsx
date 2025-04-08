import backgroundImage from "../assets/Images/creeper-in-whatsapp-default-backdrop-v0-bow5gv7xh6ba1.jpg";
import TypeInput from "./TypeInput";
import Messages from "./Messages";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../context/UserContext";
import { useAuth } from "../context/AuthProvider";

const Chart = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      position: "relative",
    },

    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(229, 221, 213, 0.4)", // Light beige overlay like WhatsApp
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto",
      // Slightly transparent to show background
      backgroundImage: `url(${backgroundImage})`,
    },
  };

  // user send message
  const [loading, setLoading] = useState(false);
  const { selectedUser, messages, setMessages } = useUserStore();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const userSendMessage = async (e) => {
    setLoading(true);

    if (selectedUser && selectedUser?._id && (message.trim() || imagePreview)) {
      try {
        const formData = new FormData();
        formData.append("message", message);
        if (imagePreview) {
          formData.append("image", imagePreview);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/message/send/${
            selectedUser?._id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.status === 201) {
          setMessages([...messages, response?.data?.newMessage]);
          setImagePreview(null);
          setMessage("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    userSendMessage();
  };

  return (
    <div style={styles.container}>
      {/* Content container */}
      <div style={styles.content}>
        <div style={styles.messagesContainer}>
          <Messages />
        </div>

        <TypeInput
          message={message}
          setMessage={setMessage}
          submitHandler={submitHandler}
          fileInputRef={fileInputRef}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Chart;
