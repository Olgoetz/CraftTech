import React from "react";
import { auth } from "@/auth";
import { User } from "next-auth";
import Profile from "@/components/Profile";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const user: User = session.user as User;

  // const confirmations = await getConfirmations(user.id as string);
  // const { dataPrivacy, dataProcessing } = confirmations;

  return (
    <main>
      <h1 className="text-4xl font-bold">Mein Profil</h1>
      <Profile />
    </main>
  );
};
export default Page;
