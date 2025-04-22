import React from "react";
import { auth } from "@/auth";

import Profile from "@/components/Profile";
import { getProfile } from "@/lib/actions/profile.actions";
import { User } from "@/types";
import {
  getAdditionalFiles,
  getAttestations,
} from "@/lib/actions/upload.actions";

const Page = async () => {
  // Load profile data
  const session = await auth();
  const user = session?.user as User;
  const userId = user.id as string;

  const [rawProfile, attestations, additionalFiles] = await Promise.all([
    getProfile(userId),
    getAttestations(),
    getAdditionalFiles(),
  ]);
  console.log(attestations);

  const profile = {
    userId,
    street: rawProfile?.street || undefined,
    zipCode: rawProfile?.zipCode || undefined,
    city: rawProfile?.city || undefined,
    phone: rawProfile?.phone || undefined,
  };

  return (
    <main>
      <h1 className="text-4xl font-bold">Mein Profil</h1>
      <Profile
        user={user}
        street={profile.street}
        zipCode={profile.zipCode}
        city={profile.city}
        phone={profile.phone}
        attestations={attestations}
        additionalFiles={additionalFiles}
      />
    </main>
  );
};

export default Page;
