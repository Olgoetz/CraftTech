import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <section className="p-4">
        <div>{children}</div>
      </section>
    </main>
  );
};

export default Layout;
