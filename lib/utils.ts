import { auth } from "@/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const logger = (
  level: "info" | "warn" | "debug" | "error",
  message: string,
  data?: any
) => {
  const msg = `${new Date().toISOString()} [${level.toUpperCase()}] ${message} ${
    data || ""
  }`;
  if (process.env.LOG_LEVEL === "debug") {
    console.log(msg);
  }
  console.log(msg);
};

export const splitPresignedUrl = (url: string) => {
  const splitUrl = url.split("?");
  const fileName = splitUrl[0].split("/").pop();
  return {
    url: splitUrl[0],
    query: splitUrl[1],
    fileName,
  };
};

// export const getUserId = async () => {
//   const session = await auth();

//   if (!session) {
//     throw new Error("User not logged in");
//   }
//   const userId = session.user?.id as string;

//   return userId;
// };
