import MemberArea from "@/components/MemberArea";
import React from "react";

const Page = () => {
  return (
    <main>
      <h1 className="text-2xl md:text-4xl font-extrabold">
        Willkommen in deinem Bereich
      </h1>

      <MemberArea />
    </main>
  );
};

export default Page;
