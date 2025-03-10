import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import { UserProvider } from "./context/UserContext";
import SocketProvider from "./context/SocketContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
