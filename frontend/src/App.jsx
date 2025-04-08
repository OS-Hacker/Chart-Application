import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Left from "./Home/Left/Left";
import Right from "./Home/Right/Right";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SingUp from "./components/SingUp";

const App = () => {
  const { user, isDrawerOpen, setIsDrawerOpen } = useAuth(); // Get the user from the AuthProvider context

  return (
    <div className="flex m-0 p-0">
      {/* Define routes */}
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/"
            element={
              user ? (
                <>
                  {/* Drawer wrapper for mobile */}
                  <div
                    className={`drawer lg:drawer-open h-screen w-full ${
                      isDrawerOpen ? "drawer-open" : ""
                    }`}
                  >
                    <input
                      id="my-drawer-2"
                      type="checkbox"
                      className="drawer-toggle"
                    />
                    {/* Main Content */}
                    <div className="drawer-content flex flex-col items-center justify-start h-full overflow-hidden">
                      <Right />
                    </div>
                    {/* Sidebar */}
                    <div className="drawer-side">
                      <label
                        htmlFor="my-drawer-2"
                        aria-label="close sidebar"
                        className="drawer-overlay overflow-hidden"
                      ></label>
                      <ul className="menu w-90 sm:w-92 text-base-content h-screen">
                        <Left />
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>

        {/* Signup page */}
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SingUp />}
        />

        {/* Login page */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};

export default App;


