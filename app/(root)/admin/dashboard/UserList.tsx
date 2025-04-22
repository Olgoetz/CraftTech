import React from "react";
import UserItem from "./UserItem";
import { UserObject } from "@/types";

const UserList = ({ users }: { users: UserObject[] }) => {
  return (
    <div className="grid grid-cols-1 ">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
