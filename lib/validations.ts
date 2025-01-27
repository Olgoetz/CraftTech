import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const confirmationSchema = z.object({
  email: z.string().email(),
  dataPrivacy: z.boolean().default(false),
  dataProcessing: z.boolean().default(false),
});

// Define a regex for validating phone numbers
const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
export const profileSchema = z.object({
  street: z
    .string()
    .min(3, { message: "Straße muss mindestens 3 Zeichen lang sein" }),
  zipCode: z.string().min(3, { message: "PLZ muss angegeben werden" }).max(5),
  city: z.string(),
  phone: z
    .string()
    .nonempty("Telefonnummer darf nicht leer sein")
    .refine((value) => phoneNumberRegex.test(value), {
      message: "Ungültige Telefonnummer",
    }),
});
