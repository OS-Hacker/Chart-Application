import React from "react";
import Header from "../../components/Header";
import Chart from "../../components/Chart";
import { useUserStore } from "../../context/UserContext";
import NoChatSelected from "../../components/NoChartSelected";

const Right = () => {
  const { selectedUser } = useUserStore(); // Get messages and selected user from context

  return (
    <>
      <div
        className="w-full h-screen text-white"
        style={{ backgroundColor: "#1c232b" }}
      >
        {selectedUser ? (
          <>
            <Header />
            <Chart />
          </>
        ) : (
          <div className="text-center text-gray-500">
            <NoChatSelected />
          </div>
        )}
      </div>
    </>
  );
};

export default Right;
