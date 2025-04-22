"use client";

import React, { useState } from "react";
import debounce from "debounce";
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";

import { z } from "zod";

import { profileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";

import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { getCity } from "@/lib/openPlzApi";
import {
  CheckCircle,
  Contact2,
  FileIcon,
  TrafficConeIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { FileUploader } from "./FileUploader";
import { upsertProfile } from "@/lib/actions/profile.actions";
import { toast } from "sonner";
import { EN_FILE_TYPES } from "@/constants";
import FileDownloadButton from "./FileDownloadButton";
import FileDeleteButton from "./FileDeleteButton";
import FileUploadButton from "./FileUploadButton";

import { uploadFile } from "@/lib/actions/upload.actions";
import { useSession } from "next-auth/react";
import { AdditionalFile, Attestation, ProfileProps } from "@/types";

type State = "checking" | "missingFiles" | "invalidFiles" | "checked";

const state: State = "checking";

const Profile = ({
  user,
  street,
  zipCode,
  city,
  phone,
  attestations,
  additionalFiles,
}: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  //const [files, setFiles] = useState<Record<string, string>>({});

  const personalDataform = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zipCode: zipCode || "",
      city: city || "",
      street: street || "",
      phone: phone || "",
    },
  });

  // const [_businessLicense, setbusinessLicense] = useState<string | null>(
  //   businessLicense || null
  // );
  // const [_insurance, setInsurence] = useState<string | null>(insurance || null);
  // const [_financialStatement, setfinancialStatement] = useState<string | null>(
  //   financialStatement || null
  // );

  //   const accountDataform = useForm<z.infer<typeof profileSchema>>({
  //     resolver: zodResolver(profileSchema),
  //     defaultValues: {
  //       email: "",
  //       password: "",
  //     },
  //   });
  const debouncedGetCity = debounce(async (zipCode: string) => {
    if (!zipCode) {
      personalDataform.setValue("city", "");
      return;
    }

    try {
      const city = (await getCity(zipCode))[0]?.district?.name || "";
      personalDataform.setValue("city", city);
    } catch (error) {
      console.error("Error fetching city:", error);
      personalDataform.setValue("city", "");
    }
  }, 500);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;
    personalDataform.setValue("zipCode", zipCode); // Update form state
    debouncedGetCity(zipCode); // Fetch city with debounce
  };

  const handleProfileOnSubmit = async (
    values: z.infer<typeof profileSchema>
  ) => {
    console.log(values);
    setIsLoading(true);

    try {
      await upsertProfile({ ...values, user });
      toast.success("Profil erfolgreich gespeichert!");
    } catch (err) {
      console.log(err);
      toast.error("Etwas ist schief gelaufen. Versuche es nochmal!");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOnUploadComplete = (key: string, value: string) => {
  //   setFiles((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };
  return (
    <div className="my-8 space-y-8">
      <Form {...personalDataform}>
        <form
          onSubmit={personalDataform.handleSubmit(handleProfileOnSubmit)}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Contact2 size={35} className="text-primary" />
            <h2 className="text-2xl font-bold">Profil</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input type="text" disabled defaultValue={user?.name || ""} />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input type="email" disabled defaultValue={user?.email || ""} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              control={personalDataform.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="street" className="text-sm font-medium">
                    Adresse
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalDataform.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="zipCode" className="text-sm font-medium">
                    PLZ
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={handleZipCodeChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalDataform.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="city" className="text-sm font-medium">
                    Stadt
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled
                      {...field}
                      placeholder="Wird automatisch ausgefüllt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalDataform.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone" className="text-sm font-medium">
                    Telefonnummer
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              className="mt-4 w-full md:w-auto"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Speichere..." : "Speichern"}
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <FileIcon size={35} className="text-primary" />
          <h2 className="text-2xl font-bold">Dokumente</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {attestations?.map((el: any) => (
            <div
              key={el.fileType.id}
              className="flex flex-col items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow h-[200px]"
            >
              <Label className="py-1 font-semibold text-center">
                {EN_FILE_TYPES[el.fileType.name as string]}
              </Label>
              <FileUploader fileType={el.fileType.name} />
              {el.attestation ? (
                <div className="text-sm py-2 flex flex-col items-center">
                  <div className="truncate w-full text-center">
                    {el.attestation.fileName}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <FileDownloadButton fileName={el.attestation.fileName} />
                    <FileDeleteButton
                      fileId={el.attestation.id}
                      table="attestations"
                      fileName={el.attestation.fileName}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500 py-4 text-center">
                  Keine Datei vorhanden
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="w-full space-y-4">
          <FileUploadButton
            uploadFunction={uploadFile}
            disabled={additionalFiles?.length == 5}
          />
        </div>
        <div className="grid gap-4">
          {additionalFiles &&
            additionalFiles.map((file: AdditionalFile) => (
              <div
                key={file.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium truncate">
                  {file.fileName}
                </div>
                <div className="flex items-center gap-2">
                  <FileDownloadButton fileName={file.fileName} />
                  <FileDeleteButton
                    fileName={file.fileName}
                    fileId={file.id}
                    table="additionalFiles"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <TrafficConeIcon size={35} className="text-primary" />
          <h2 className="text-2xl font-bold">
            Status (
            {
              attestations?.filter((item) => item.attestation !== null)
                .length as number
            }
            /3)
          </h2>
        </div>

        <div>
          {(attestations?.filter((item) => item.attestation !== null)
            .length as number) == 3 ? (
            <div className="bg-green-100 p-4 flex rounded-lg items-center gap-x-4 text-sm text-green-700">
              <CheckCircle size={35} className="shrink-0" />
              <p>
                Alle Bescheinigungen sind hochgeladen. Sie können jetzt für die
                Rechnungsstellung freigeschaltet werden. Sobald Sie von uns
                freigeschaltet wurden, werden wir Sie per E-Mail
                benachrichtigen.
              </p>
            </div>
          ) : (
            <div className="bg-red-100 p-4 flex rounded-lg items-center gap-x-4 text-sm text-red-700">
              <TriangleAlertIcon size={35} className="shrink-0" />
              <p>
                Es müssen alle Bescheinigungen hochgeladen und gültig sein. Erst
                dann können wir Sie für die Rechnungsstellung freigeben. Falls
                Sie Rückfragen haben, wenden Sie sich bitte an unseren Support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
