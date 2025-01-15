import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  // const session = await auth();

  // if (session) redirect("/");
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex gap-4 items-center">
            <Image
              src="/rotes_logo.png"
              alt="Craft.tech Logo"
              width={40}
              height={40}
            />
            <h1 className="text-3xl font-semibold">Craft.tech</h1>
          </div>
          <div>{children}</div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
