import Search from "../../components/Search";
import Logout from "../../components/Logout";
import { FiEdit } from "react-icons/fi";
import Users from "../../components/Users";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../../context/UserContext";
import { useSocket } from "../../context/SocketContext";
import ProfileModal from "../../components/ProfileModal";

const Left = () => {
  const { users, setUsers, messages } = useUserStore(); // Remove `messages` if not needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const [search, setSearch] = useState("");
  const { user, setIsProfileModalOpen } = useAuth();
  const { onlineUsers, socket } = useSocket();

  // Fetch all users
  const GetAllUsers = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/getUsers`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(response.data?.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search users by query
  const SearchUser = async (query) => {
    if (!query) {
      GetAllUsers(); // Reset to all users if search query is empty
      return;
    }
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/search?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(response.data?.users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    GetAllUsers();
  }, []); // Empty dependency array to ensure it only runs on mount

  // Debounce search input to reduce API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim() !== "") {
        SearchUser(search);
      } else {
        GetAllUsers(); // Reset to all users
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div
      className="w-full text-white px-7 h-screen"
      style={{ backgroundColor: "#191E24" }}
    >
      {/* Header Section */}
      <div className="flex justify-between align-center mt-3">
        <h3 className="text-xl font-bold">Chat</h3>
        <div className="icon mt-2 text-lg cursor-pointer hover:text-green-500">
          <FiEdit onClick={() => setIsProfileModalOpen(true)} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-1">
        <Search search={search} setSearch={setSearch} />
      </div>

      {/* Users Section */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {error ? (
          <div className="text-center text-red-500">{error}</div> // Show error message
        ) : (
          <Users users={users} loading={loading} />
        )}
      </div>

  
    </div>
  );
};

export default Left;
