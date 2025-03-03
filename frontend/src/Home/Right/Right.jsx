import React from "react";
import Header from "../../components/Header";
import Chart from "../../components/Chart";

const Right = () => {
  return (
    <>
      <div
        className="w-[75%] h-screen text-white"
        style={{ backgroundColor: "#1c232b" }}
      >
        <Header />
        <Chart />
      </div>
    </>
  );
};

export default Right;
