import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // selected only one user
  const [selectedUser, setSelectedUser] = useState(null);

  // handle massages
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        users,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);
