import Search from "../../components/Search";
import Logout from "../../components/Logout";
import { FiEdit } from "react-icons/fi";
import Users from "../../components/Users";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";

const Left = () => {
  //  Get ALL Users
  const [users, setUsers] = useState([]);

  const [user] = useAuth();

  console.log(users);

  const GetAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/getUsers`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Include the token in the request
          },
        }
      );
      if (response.status === 200) {
        const data = response?.data;
        setUsers(data?.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetAllUsers();
  }, []);

  // Search UserName

  const [search, setSearch] = useState("");

  const SearchUser = async (query) => {
    if (!query) {
      setUsers(users); // Reset to all users if search query is empty
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/search?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Include the token in the request
          },
        }
      );
      if (response.status === 200) {
        const data = response?.data;
        setUsers(data?.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      SearchUser(search);
    } else {
      GetAllUsers(); // Reset to all users
    }
  }, [search]);

  return (
    <div
      className="w-[25%] text-white px-8 h-screen flex flex-col"
      style={{ backgroundColor: "#191E24" }}
    >
      {/* Header Section */}
      <div className="flex justify-between align-center mt-4 mb-4">
        <h3 className="text-xl font-bold">Chart</h3>
        <div className="icon mt-2 text-lg cursor-pointer hover:text-green-500">
          <FiEdit />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Search search={search} setSearch={setSearch} />
      </div>

      {/* Users Section with Hidden Scrollbar */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <Users users={users} />
      </div>

      {/* Logout Section */}
      <div className="py-4">
        <Logout />
      </div>
    </div>
  );
};

export default Left;
