import React from "react";
import User from "./User";

const Users = ({ users ,loading}) => {
  return (
    <div
      style={{ maxHeight: "calc(90vh)" }} // Fixed height
    >
      <User users={users} loading={loading} />
    </div>
  );
};

export default Users;
