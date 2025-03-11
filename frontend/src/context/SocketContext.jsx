import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth(); // Get current user from auth context

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user?.user?._id) {
      // Initialize the socket connection
      const socket = io("http://localhost:5002", {
        // Change the port number here
        query: {
          userId: user?.user?._id, // Pass the user ID to the server
        },
      });
      setSocket(socket);
      socket.on("getOnline", (users) => {
        setOnlineUsers(users);
        console.log("Socket disconnected");
      });
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user?.user?._id]); // Re-run effect when user ID changes

  console.log(socket);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => useContext(SocketContext);
