import { auth } from "@/auth";
import Header from "@/components/Header";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-1 flex-col px-5 xs:px-10 md:px-16;">
      <div className="mx-auto w-full max-w-7xl">
        <Header session={session} />

        <div className="max-w-[1200px] mx-auto mt-12 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
