import React from "react";
import Left from "./Home/Left/Left";
import Right from "./Home/Right/Right";
import Logout from "./components/Logout";

const App = () => {
  return (
    <div className="flex h-screen">
      <Left />
      <Right />
    </div>
  );
};

export default App;
