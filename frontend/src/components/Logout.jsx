import React from "react";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

const Logout = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Send a request to the backend to blacklist the token
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Include the token in the request
          },
        }
      );

      // Clear frontend authentication state
      logout();

      toast.success("Logout Successful", {
        position: "top-center",
      });

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <LuLogOut
      onClick={handleLogout}
      className="font-bold text-2xl cursor-pointer hover:text-red-600 absolute bottom-8 left-4"
    />
  );
};

export default Logout;
