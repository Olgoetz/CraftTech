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

import { useSession } from "next-auth/react";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { getCity } from "@/lib/openPlzApi";
import { Contact2, FileIcon, LogInIcon, TriangleAlertIcon } from "lucide-react";
import { FileUploader } from "./FileUploader";

const Profile = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  //const [files, setFiles] = useState<Record<string, string>>({});
  const personalDataform = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zipCode: "",
      city: "",
      street: "",
      phone: "",
    },
  });

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

  const handleOnSubmit = async (values: z.infer<typeof profileSchema>) => {
    console.log(values);
    setIsLoading(true);
    setIsLoading(false);
    // const { , dataProcessing } = values;
    // setIsLoading(true);
    // const result = await createOrUpdateConfirmations({
    //   dataPrivacy,
    //   dataProcessing,
    // });
    // if (result.success) {
    //   toast.success("Zustimmungen erfolgreich aktualisiert");
    // } else {
    //   toast.error("Etws ist schief gelaufen");
    // }
    // setIsLoading(false);
    alert("Form submitted");
  };
  const handleAccountOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Account Form submitted");
  };

  // const handleOnUploadComplete = (key: string, value: string) => {
  //   setFiles((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };
  return (
    <div className="my-8">
      <form onSubmit={handleAccountOnSubmit} className="space-y-4 mb">
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

            <Input type="text" defaultValue={session?.user?.name || ""} />
          </div>

          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </Label>

            <Input
              type="email"
              disabled
              defaultValue={session?.user?.email || ""}
            />
          </div>
        </div>

        <div>
          <Button className="my-4" type="submit" disabled={isLoading}>
            {isLoading ? "Speichere..." : "Speichern"}
          </Button>
        </div>
      </form>

      <Separator className="my-4" />

      <Form {...personalDataform}>
        <form
          onSubmit={personalDataform.handleSubmit(handleOnSubmit)}
          className="space-y-4"
        >
          <div className="flex  items-center">
            <Contact2 size={35} className="mr-4" />
            <h2 className="text-xl font-semibold">Kontakt</h2>
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
          <div className="w-full text-center space-y-2">
            <Label className="py-1 font-semibold">Bescheinigung 1</Label>
            <FileUploader />
          </div>
          <div className="w-full text-center space-y-2">
            <Label className="py-1 font-semibold">Bescheinigung 2</Label>
            <FileUploader />
          </div>
          <div className="w-full text-center space-y-2">
            <Label className="py-1 font-semibold">Bescheinigung 3</Label>
            <FileUploader />
          </div>
        </div>
        <Button disabled>Abschicken</Button>
      </div>

      <Separator className="mb-4 mt-8" />

      <div className="space-y-4">
        <div className="flex items-center ">
          <FileIcon size={35} className="mr-4" />
          <h2 className="text-xl font-semibold">Status</h2>
        </div>

        <div className="bg-destructive/15 p-4 flex rounded-md items-center gap-x-4 text-sm  text-destructive">
          <TriangleAlertIcon size={35} className="shrink-0" />
          <p>
            Es müssen alle Bescheinigungen hoch geladen und gültig sein. Erst
            dann können wir Sie für die Rechnungsstellung freigeben. Falls Sie
            Rückfragen haben, wenden Sie sich bitte an unseren Support.
          </p>
        </div>

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
