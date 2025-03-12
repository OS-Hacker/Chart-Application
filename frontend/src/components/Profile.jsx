import React from "react";
import { useAuth } from "../context/AuthProvider";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col mr-12 items-center md:flex-row md:items-start">
      {/* Profile Image */}
      <label htmlFor="profile" className="cursor-pointer">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-24 lg:ml-14 h-24 rounded-full ring ring-offset-2">
            <img
              src={user?.user?.profileImage}
              alt="User Profile"
              className="w-full h-full rounded-full object-cover "
            />
          </div>
        </div>
        {/* User Details */}
        <div className="mt-3 md:mt-0 md:ml-6 lg:mt-3 lg:mr-18 text-center md:text-left">
          <h1 className="text-xl font-bold">{user?.user?.userName}</h1>
          <h2 className="text-gray-600">{user?.user?.email}</h2>
        </div>
      </label>
    </div>
  );
};

export default Profile;
