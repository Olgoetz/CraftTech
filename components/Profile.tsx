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
  Download,
  DownloadIcon,
  FileDown,
  FileIcon,
  LogInIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { FileUploader } from "./FileUploader";
import { upsertProfile } from "@/lib/actions/profile.actions";
import { toast } from "sonner";
import { User } from "next-auth";
import { attestations } from "@/database/schema";
import Link from "next/link";
import { splitPresignedUrl } from "@/lib/utils";
import { stat } from "fs";
import { EN_FILE_TYPES } from "@/constants";
import FileDownloadButton from "./FileDownloadButton";
import FileDeleteButton from "./FileDeleteButton";

type State = "checking" | "missingFiles" | "invalidFiles" | "checked";

const state: State = "checking";

const Profile = ({
  user,
  street,
  zipCode,
  city,
  phone,
  attestations,
}: ProfileProps) => {
  //const { data: session } = useSession();
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
    <div className="my-8">
      {/* <form onSubmit={handleAccountOnSubmit} className="space-y-4 mb">
        <div className="flex  items-center">
          <LogInIcon size={35} className="mr-4" />
          <h2 className="text-xl font-semibold">Login</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 ">
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Name
            </Label>

            <Input type="text" disabled defaultValue={user?.name || ""} />
          </div>

          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </Label>

            <Input type="email" disabled defaultValue={user?.email || ""} />
          </div>
        </div>

        <div>
          <Button className="my-4" type="submit" disabled={isLoading}>
            {isLoading ? "Speichere..." : "Speichern"}
          </Button>
        </div>
      </form> */}

      <Form {...personalDataform}>
        <form
          onSubmit={personalDataform.handleSubmit(handleProfileOnSubmit)}
          className="space-y-4"
        >
          <div className="flex  items-center">
            <Contact2 size={35} className="mr-4" />
            <h2 className="text-xl font-semibold">Profil</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 ">
            <div className="flex flex-col space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </Label>

              <Input type="text" disabled defaultValue={user?.name || ""} />
            </div>

            <div className="flex flex-col space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </Label>

              <Input type="email" disabled defaultValue={user?.email || ""} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={personalDataform.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="street"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
                  <FormLabel
                    htmlFor="zipCode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
                  <FormLabel
                    htmlFor="city"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
                  <FormLabel
                    htmlFor="phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
            <Button className="mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Speichere..." : "Speichern"}
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="mb-4 mt-8" />

      <div className="space-y-4">
        <div className="flex items-center ">
          <FileIcon size={35} className="mr-4" />
          <h2 className="text-xl font-semibold">Dokumente</h2>
        </div>
        <div className="grid md:grid-cols-3 justify-center items-center gap-4">
          {attestations?.map((el: any) => (
            <div
              key={el.fileType.id}
              className="w-full text-center space-y-2 h-[200px]"
            >
              <Label className="py-1 font-semibold">
                {EN_FILE_TYPES[el.fileType.name as string]}
              </Label>
              <FileUploader fileType={el.fileType.name} />
              {el.attestation ? (
                <div className="text-sm py-2">
                  <div className="grid grid-cols-3 w-full items-center">
                    {/* <div className="flex justify-center items-center gap-2">
                      <FileDownloadButton fileName={el.attestation.fileName}>
                       <DownloadIcon size={20} className="shrink-0" />
                        {el.attestation.fileName}
                      </FileDownloadButton>
                    </div> */}
                    <div className="grid col-span-2">
                      {el.attestation.fileName}
                    </div>
                    <div className="grid col-span-1">
                      <div className="flex justify-center items-center gap-2">
                        <FileDownloadButton
                          fileName={el.attestation.fileName}
                        />
                        <FileDeleteButton fileName={el.attestation.fileName} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500 py-4">
                  Keine Datei vorhanden
                </p>
              )}
            </div>
          ))}

          {/* <Label className="py-1 font-semibold">Gewerbeschein</Label>
            <FileUploader fileName={"Business License"} />
            {businessLicense ? (
              <div className="text-sm py-4">
                <Link href={businessLicense}>
                  <div className="flex justify-center items-center gap-2">
                    <DownloadIcon size={20} className="shrink-0" />
                    {splitPresignedUrl(businessLicense).fileName}
                  </div>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-red-500 py-4">Keine Datei vorhanden</p>
            )}
          */}
          {/* <div className="w-full text-center space-y-2">
            <Label className="py-1 font-semibold">Berufshaftpflicht</Label>
            <FileUploader fileName="Insurance" />
            {insurance ? (
              <div className="text-sm py-4">
                <Link href={insurance}>
                  <div className="flex justify-center items-center gap-2">
                    <DownloadIcon size={20} className="shrink-0" />
                    {splitPresignedUrl(insurance).fileName}
                  </div>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-red-500 py-4">Keine Datei vorhanden</p>
            )}
          </div> */}
          {/* <div className="w-full text-center space-y-2">
            <Label className="py-1 font-semibold">
              Freistellungsbescheinigung Finanzamt
            </Label>
            <FileUploader fileName="FinancialStatement" />
            {financialStatement ? (
              <div className="text-sm py-4">
                <Link href={financialStatement}>
                  <div className="flex justify-center items-center gap-2">
                    <DownloadIcon size={20} className="shrink-0" />
                    {splitPresignedUrl(financialStatement).fileName}
                  </div>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-red-500 py-4">Keine Datei vorhanden</p>
            )}
          </div> */}
        </div>
      </div>

      <Separator className="mb-4 mt-8" />

      <div className="space-y-4">
        <div className="flex items-center ">
          <FileIcon size={35} className="mr-4" />
          <h2 className="text-xl font-semibold">
            Status (
            {
              attestations?.filter((item) => item.attestation !== null)
                .length as number
            }
            /3)
          </h2>
        </div>

        <div className="">
          {(attestations?.filter((item) => item.attestation !== null)
            .length as number) == 3 ? (
            <div className="bg-green-500/15 p-4 flex rounded-md items-center gap-x-4 text-sm  text-success">
              <CheckCircle size={35} className="shrink-0" />
              <p>
                Alle Bescheinigungen sind hochgeladen. Sie können jetzt für die
                Rechnungsstellung freigeschaltet werden. Sobald Sie von uns
                freigeschlatet wurden, werden wir Sie per E-Mail
                benachrichtigen.
              </p>
            </div>
          ) : (
            <div className="bg-destructive/15 p-4 flex rounded-md items-center gap-x-4 text-sm  text-destructive">
              <TriangleAlertIcon size={35} className="shrink-0" />
              <p>
                Es müssen alle Bescheinigungen hoch geladen und gültig sein.
                Erst dann können wir Sie für die Rechnungsstellung freigeben.
                Falls Sie Rückfragen haben, wenden Sie sich bitte an unseren
                Support.
              </p>
            </div>
          )}
        </div>

        {/* {state === "checking" && (
          <p>Überprüfung der Bescheinigungen durch Fachabteilung</p>
        )} */}

        {/*
        <div className="bg-green-400/15 p-4 flex rounded-md items-center gap-x-4 text-sm  text-green-400">
          <CircleCheckIcon size={35} className="shrink-0" />
          <p>
            Es müssen alle Bescheinigungen hoch geladen und gültig sein. Erst
            dann können wir Sie für die Rechnungsstellung freigeben. Falls Sie
            Rückfragen haben, wenden Sie sich bitte an unseren Support.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
