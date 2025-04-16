import React from "react";
import { auth } from "@/auth";

import Profile from "@/components/Profile";
import { getProfile } from "@/lib/actions/profile.actions";
import { User } from "next-auth";
import { getAttestations, renderFile } from "@/lib/actions/upload.actions";

const Page = async () => {
  // Load profile data
  const session = await auth();
  const rawProfile = await getProfile(session?.user?.id as string);

  // const confirmations = await getConfirmations(user.id as string);
  // const { dataPrivacy, dataProcessing } = confirmations;
  const profile = {
    userId: session?.user?.id as string,
    street: rawProfile?.street || undefined,
    zipCode: rawProfile?.zipCode || undefined,
    city: rawProfile?.city || undefined,
    phone: rawProfile?.phone || undefined,
  };

  const attestations = await getAttestations();
  console.log("Found");
  console.log(attestations);

  return (
    <main>
      <h1 className="text-4xl font-bold">Mein Profil</h1>
      <Profile
        user={session?.user as User}
        street={profile?.street}
        zipCode={profile?.zipCode}
        city={profile?.city}
        phone={profile?.phone}
        attestations={attestations}
      />
    </main>
  );
};
export default Page;
