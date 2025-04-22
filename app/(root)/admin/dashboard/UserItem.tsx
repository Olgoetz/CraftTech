import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdditionalFile, Attestation, UserObject } from "@/types";
import FileDownloadButton from "@/components/FileDownloadButton";

const UserItem = ({ user }: { user: UserObject }) => {
  console.log(user.attestations?.length);
  return (
    <Card className="w-full mx-auto mb-6 shadow-lg border border-gray-200 rounded-lg">
      <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {user.name || "Unbekannter Benutzer"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-sm text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UserDetails user={user} />
          <UserAttestations attestations={user.attestations} userId={user.id} />
          <UserAdditionalFiles
            additionalFiles={user.additionalFiles}
            userId={user.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const UserDetails = ({ user }: { user: UserObject }) => (
  <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
    <h3 className="text-md font-bold text-gray-800 mb-2">Benutzerdetails</h3>
    <p>
      Email:{" "}
      <span className="font-medium text-gray-600">
        {user.email || "Nicht verfügbar"}
      </span>
    </p>
    <p>
      Konto seit:{" "}
      <span className="font-medium text-gray-600">
        {new Date(user.createdAt as Date).toLocaleDateString("de")}
      </span>
    </p>
  </div>
);

const UserAttestations = ({
  attestations,
  userId,
}: {
  attestations?: Attestation[];
  userId: string;
}) => (
  <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
    <h3 className="text-md font-bold text-gray-800 mb-2">Bescheinigungen</h3>
    <ul className="list-disc pl-5 space-y-2">
      {(attestations &&
        attestations.length > 0 &&
        attestations.map((at) => (
          <li key={at.id} className="flex items-center justify-between">
            <span className="text-gray-600">{at.fileName || "Unbenannt"}</span>
            <FileDownloadButton
              fileName={at.fileName || "none"}
              userId={userId}
            />
          </li>
        ))) || <p className="text-gray-500">Keine Bescheinigungen verfügbar</p>}
    </ul>
  </div>
);

const UserAdditionalFiles = ({
  additionalFiles,
  userId,
}: {
  additionalFiles?: AdditionalFile[];
  userId: string;
}) => (
  <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
    <h3 className="text-md font-bold text-gray-800 mb-2">Weitere Dokumente</h3>
    <ul className="list-disc pl-5 space-y-2">
      {(additionalFiles &&
        additionalFiles.length > 0 &&
        additionalFiles.map((ad) => (
          <li key={ad.id} className="flex items-center justify-between">
            <span className="text-gray-600">{ad.fileName || "Unbenannt"}</span>
            <FileDownloadButton fileName={ad.fileName} userId={userId} />
          </li>
        ))) || (
        <p className="text-gray-500">Keine weiteren Dokumente verfügbar</p>
      )}
    </ul>
  </div>
);

export default UserItem;
