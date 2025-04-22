import { getAllUsers } from "@/lib/admin/actions";
import React from "react";
import UserList from "./UserList";
import { UserObject } from "@/types";

const Page = async () => {
  const users: UserObject[] = await getAllUsers(); // Fetch users dynamically
  console.log(users);
  if (!users) {
    return <div className="text-center">No users found</div>;
  }
  return (
    <main className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <UserList users={users} />
    </main>
  );
};

export default Page;
