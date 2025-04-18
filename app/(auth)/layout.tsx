import Image from "next/image";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="auth-container ">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex gap-4 items-center">
            <Image
              src="/rotes_logo.png"
              alt="Craft.tech Logo"
              width={40}
              height={40}
            />
            <h1 className="text-3xl font-semibold">baulink</h1>
          </div>
          <div>{children}</div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
