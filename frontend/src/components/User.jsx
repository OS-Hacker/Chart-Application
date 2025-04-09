import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketContext";
import { useUserStore } from "../context/UserContext";
import Loading2 from "./Loading2";

const User = ({ users, loading }) => {
  const { selectedUser, setSelectedUser } = useUserStore();
  const { socket, onlineUsers } = useSocket();
  const { isDrawerOpen, setIsDrawerOpen } = useAuth();

  const handleSelected = (id) => {
    const selectedUser = users?.find((user) => user._id === id);
    if (selectedUser) {
      setSelectedUser(selectedUser);
    }
    setIsDrawerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-sm text-gray-400">
        <Loading2 />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex justify-center items-center text-sm text-gray-400 mt-64">
        No results
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 max-h-[80vh] mt-1">
      {users.map((user) => {
        const { _id, userName, email, profileImage } = user;
        const isSelected = selectedUser?._id === _id;
        const isOnline = onlineUsers.includes(user._id);

        return (
          <div
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isSelected ? "bg-gray-800" : "hover:bg-zinc-800"
            }`}
            key={_id}
            onClick={() => handleSelected(_id)}
          >
            {/* Avatar Section */}
            <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
              <div className="w-10 sm:w-12 rounded-full">
                <img src={profileImage} alt={`${userName}'s profile`} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base lg:text-[16px] font-semibold text-white">
                {userName}
              </h1>
              <h4 className="text-xs sm:text-sm lg:text-sm text-gray-400 ">
                {email}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default User;
