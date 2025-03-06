import React from "react";
import User from "./User";

const Users = ({ users }) => {
  return (
    <div
      style={{ maxHeight: "calc(90vh)" }} // Fixed height
    >
      <User users={users}  />
    </div>
  );
};

export default Users;
