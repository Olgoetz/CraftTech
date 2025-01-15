import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";

const Page = async () => {
  const session = await auth();

  return (
    <main>
      <h1 className="text-3xl">Mein Profil</h1>
      <div className="mt-10 flex flex-col rounded-md bg-gray-100">
        <div className="rounded-t-md bg-gray-200 p-4 font-bold">
          Current Session
        </div>
        <pre className="whitespace-pre-wrap break-all px-4 py-6">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </main>
  );
};
export default Page;
