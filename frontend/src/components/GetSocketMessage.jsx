import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useUserStore } from "../context/UserContext";
import sound from "../assets/Audio/ringtones.mp3"; // Ensure the import path is correct

const GetSocketMessage = () => {
  const { socket } = useSocket();
  const { setMessages } = useUserStore();

  useEffect(() => {
    // Ensure socket is not null before attaching the event listener
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    // Handle new message event
    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);

      // Append the new message to the existing messages
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Play notification sound
      const notification = new Audio(sound);
      notification
        .play()
        .catch((error) =>
          console.error("Failed to play notification sound:", error)
        );
    };

    // Listen for new messages
    socket.on("newMessage", handleNewMessage);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages]); // Only socket and setMessages are needed in the dependency array

  // This component does not render anything
  return null;
};

export default GetSocketMessage;
