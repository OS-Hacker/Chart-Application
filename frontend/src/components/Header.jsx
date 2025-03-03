import React from "react";

const Header = () => {
  return (
    <div
      className="h-20 w-full border-b-black fixed z-10"
      style={{ backgroundColor: "#191E24" }}
    >
      <div className="card-body hover:bg-slate-800 p-3 rounded-4">
        <div className="card-actions justify-start gap-6">
          <div className="avatar avatar-online">
            <div className="w-13 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="">
            <h1 className="card-title">om shinde</h1>
            <h4>Online</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
