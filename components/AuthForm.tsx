import Link from "next/link";

import AuthWithProvider from "./AuthWithProvider";

interface Props {
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = ({ type }: Props) => {
  const isSignIn = type === "SIGN_IN";
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Willkommen bei CraftTech</h1>
      <p>Melde dich an, um fortzufahren</p>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      {...field}
                    />
                  </FormControl>
             
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="w-full">
            {isSignIn ? "Einloggen" : "Registrieren"}
          </Button>
        </form>
      </Form> */}

      {/* <form action={signInWithGoogle}>
        <button type="submit">
          {isSignIn ? "Einloggen" : "Registrieren"} mit Google
        </button>
      </form> */}

      <AuthWithProvider provider="google" />
      <AuthWithProvider provider="facebook" />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Oder nutze
          </span>
        </div>
      </div>
      <AuthWithProvider provider="resend" />

      {/* <p className="text-sm text-center font-medium">
        {isSignIn ? "Noch keinen Account?" : "Bereits einen Account?"}{" "}
        <Link
          className="text-blue-500"
          href={isSignIn ? "/sign-up" : "/sign-in"}
        >
          Jetzt {isSignIn ? "registrieren" : "anmelden"}
        </Link>
      </p> */}
    </div>
  );
};

export default AuthForm;
