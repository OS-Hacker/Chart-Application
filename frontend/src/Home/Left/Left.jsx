import React from "react";
import Search from "../../components/Search";
import Logout from "../../components/Logout";
import { FiEdit } from "react-icons/fi";
import Users from "../../components/Users";

const Left = () => {
  return (
    <div
      className="w-[25%] text-white px-8 h-screen flex flex-col"
      style={{ backgroundColor: "#191E24" }}
    >
      {/* Header Section */}
      <div className="flex justify-between mt-4 mb-3">
        <h3 className="text-xl">Chart</h3>
        <div className="icon">
          <FiEdit />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Search />
      </div>

      {/* Users Section with Hidden Scrollbar */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <Users />
      </div>

      {/* Logout Section */}
      <div className="py-4">
        <Logout />
      </div>
    </div>
  );
};

export default Left;
