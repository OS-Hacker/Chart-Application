import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Left from "./Home/Left/Left";
import Right from "./Home/Right/Right";
import SingUp from "./components/Singup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {
  const [user] = useAuth(); // Get the user from the AuthProvider context

  // {
  //   /* Privet Routes for User */
  // }
  // <Route path="/Deshbored" element={<UserPrivetRoute />}>
  //   <Route path="user" element={<Profile />} />
  // </Route>;

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Define routes */}
        <Routes>
          {/* Show Login page by default if user is not authenticated */}

          <Route element={<ProtectedRoutes />}>

            <Route
              path="/"
              element={
                user ? (
                  <>
                    <Left />
                    <Right />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

          </Route>

          {/* Show SignUp page */}
          <Route path="/signup" element={<SingUp />} />

          {/* Show Login page */}
          <Route path="/login" element={<Login />} />
        </Routes>

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
