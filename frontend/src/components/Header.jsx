import React from "react";
import { useUserStore } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import { AlignJustify } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const { selectedUser } = useUserStore();
  const { onlineUsers } = useSocket();

  // Check if the selected user is online
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const { isDrawerOpen, setIsDrawerOpen } = useAuth();

  return (
    <div
      className="h-20 w-full border-b border-black fixed z-10"
      style={{ backgroundColor: "#191E24" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 h-full">
        {/* Left Section: Avatar and User Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className={`avatar ${
              isUserOnline(selectedUser?._id) ? "avatar-online" : ""
            }`}
          >
            <div className="w-10 sm:w-12 md:w-14 lg:w-16 rounded-full">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                  selectedUser?.profileImage
                }`}
                alt={selectedUser?.userName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white">
              {selectedUser?.userName || "No User Selected"}
            </h1>
            <h4 className="text-xs sm:text-sm md:text-base text-gray-400">
              {isUserOnline(selectedUser?._id) ? "Online" : "Offline"}
            </h4>
          </div>
        </div>

        {/* Right Section: Drawer Toggle (Visible on Mobile) */}
        <div className="lg:hidden">
          <AlignJustify
            className="w-6 h-6 sm:w-8 sm:h-8 text-primary cursor-pointer"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
