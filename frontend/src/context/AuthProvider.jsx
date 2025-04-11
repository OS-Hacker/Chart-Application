import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.token || !parsedUser.user) {
        console.warn("Invalid user data in localStorage");
        return null;
      }
      return parsedUser;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  // Profile Model state management
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setIsProfileModalOpen(false); // Close modal on logout
      toast.success("Logout Successfull!");
      <Navigate to="/login" />;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        credentials
      );

      if (response.data) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Drawer state management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        login,
        isProfileModalOpen,
        setIsProfileModalOpen,
        setIsDrawerOpen,
        isDrawerOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
