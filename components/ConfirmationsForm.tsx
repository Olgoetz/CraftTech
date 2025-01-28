"use client";

import { confirmationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";

import { CONFIRMATIONS } from "@/constants";

const ConfirmationsForm = (confirmations: ConfirmationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof confirmationSchema>>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      email: "",
      dataPrivacy: false || confirmations.dataPrivacy,
      dataProcessing: false || confirmations.dataProcessing,
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof confirmationSchema>) => {
    console.log(values);
    // const { dataPrivacy, dataProcessing } = values;
    setIsLoading(true);
    // const result = await createOrUpdateConfirmations({
    //   dataPrivacy,
    //   dataProcessing,
    // });

    setIsLoading(false);
  };
  return (
    <section className="my-12">
      <h2 className="text-xl  py-4">Zustimmungen</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOnSubmit)}
          className="space-y-4 mb"
        >
          {/* <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-x-2 flex items-center">
                    <FormControl>
                      <Checkbox
                        id={key}
                        onCheckedChange={field.onChange}
                        checked={field.value}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </FormLabel>
                  </div>
                  <FormMessage />
              </FormItem>
            )}
          /> */}

          {Object.entries(CONFIRMATIONS).map(([key, label]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof ConfirmationsProps}
              render={({ field }) => (
                <FormItem>
                  <div className="space-x-2 flex items-center">
                    <FormControl>
                      <Checkbox
                        id={key}
                        onCheckedChange={field.onChange}
                        checked={field.value}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* <FormField
            control={form.control}
            name="dataPrivacy"
            render={({ field }) => (
              <FormItem>
                <div className="space-x-2 flex items-center">
                  <FormControl>
                    <Checkbox
                      id="dataPrivacy"
                      onCheckedChange={field.onChange}
                      checked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Datenschutzerklärung
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <div>
            <Button className="mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Spechere..." : "Speichern"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ConfirmationsForm;
