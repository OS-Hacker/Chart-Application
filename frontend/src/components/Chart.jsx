import backgroundImage from "../assets/Images/creeper-in-whatsapp-default-backdrop-v0-bow5gv7xh6ba1.jpg";
import TypeInput from "./TypeInput";
import Messages from "./Messages";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../context/UserContext";
import { useAuth } from "../context/AuthProvider";

const Chart = () => {
  const styles = {
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      alignItems: "center",
      color: "white", // Text color
    },
  };

  // user send message
  const [loading, setLoading] = useState(false);
  const { selectedUser, messages, setMessages } = useUserStore(); // Add `user` from context
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
          formData.append("image", imagePreview); // Append the image file
        }

        // const formData = { message, imagePreview };

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
          setMessages([...messages, response?.data?.newMessage]); // Update messages with the new message
          setImagePreview(null);
          setMessage(""); // Clear the input field
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error (e.g., display an error message)
      } finally {
        setLoading(false);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    userSendMessage();
  };

  return (
    <div style={styles.background} className="h-screen">
      <div className="">
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
  );
};

export default Chart;
