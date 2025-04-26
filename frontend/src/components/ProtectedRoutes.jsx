import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoutes = ({}) => {
  const { user, logout } = useAuth();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/user-protect`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`, // Include the token in the request
            },
          }
        );

        if (data.ok) {
          setOk(true);
        } else {
          setOk(false);
          navigate("/login"); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login"); // Redirect to login on error
        // If token verification failed, clear user data
        if (error.response?.status === 401) {
          logout(); // Clear user from context and local storage
        }
        setOk(false);
      } finally {
        setLoading(false); // Set loading to false after the check is complete
      }
    };

    if (user?.token) {
      checkAuth();
    } else {
      setLoading(false); // If there's no token, no need to check auth
      navigate("/login"); // Redirect to login if no token is present
    }
  }, [user?.token, navigate, logout]);

  if (loading) {
    return (
      <div className="flex justify-center align-center w-full mt-72">
        <span className="loading loading-dots loading-xl "></span>
      </div>
    ); // Render a loading indicator while checking auth
  }

  return ok ? <Outlet /> : null;
};

export default ProtectedRoutes;
