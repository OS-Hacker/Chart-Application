import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  // Logout function
  const logout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem("user"); // Remove user data from localStorage
    delete axios.defaults.headers.common["Authorization"]; // Remove token from axios headers
  };

  return (
    <AuthContext.Provider value={[user, setUser, logout]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
