import { auth } from "@/auth";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  return <AuthForm type="SIGN_IN" />;
};

export default Page;
