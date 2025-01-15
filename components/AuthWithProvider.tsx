import { signIn } from "@/auth";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import { capitalized } from "@/lib/utils";
import { Input } from "./ui/input";
import Image from "next/image";

interface Props {
  provider: string;
}

const AuthWithProvider = ({ provider }: Props) => {
  const isMagicLink = provider === "resend";

  if (isMagicLink) {
    return (
      <form
        action={async (formData) => {
          "use server";
          await signIn(provider, formData);
        }}
      >
        <div className="flex flex-col gap-4">
          <Input required type="text" name="email" placeholder="Email" />
          <Button className="w-full" variant="outline">
            <div className="max-w-md flex items-center gap-8">
              <Image
                alt={`${provider} logo`}
                src={`/icons/${provider}.svg`}
                width={22}
                height={22}
              />

              <div className="w-[200px] text-left">
                Einloggen mit {capitalized(provider)}
              </div>
            </div>
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <Button className="w-full" variant="outline">
        <div className="max-w-md flex items-center gap-8">
          <Image
            alt={`${provider} logo`}
            src={`/icons/${provider}.svg`}
            width={22}
            height={22}
          />

          <div className="w-[200px] text-left">
            Einloggen mit {capitalized(provider)}
          </div>
        </div>
      </Button>
    </form>
  );
};

export default AuthWithProvider;
