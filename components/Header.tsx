import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Header = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <header className="my-10 flex items-center justify-between gap-5">
      <Link href="/">
        <Image
          src="/rotes_logo.png"
          alt="CraftTech Logo"
          width={60}
          height={60}
        />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback className="bg-red-500 text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/mein-profil">Mein Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              "use server";
              await signOut();
            }}
          >
            Ausloggen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <ul className="flex flex-row justify-center gap-8">
        <li>
          <Link href="/mein-profil">
            <Avatar>
              <AvatarFallback className="bg-red-500 text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul> */}
    </header>
  );
};

export default Header;
