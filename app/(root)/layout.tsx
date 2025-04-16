import Header from "@/components/Header";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-1 flex-col px-5 xs:px-10 md:px-16;">
      <div className="mx-auto w-full max-w-7xl">
        <Header />

        <div className="max-w-[1000px] mx-auto mt-12 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
