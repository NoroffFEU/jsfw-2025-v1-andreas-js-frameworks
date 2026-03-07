import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.email("Enter a valid email address."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  zip: z.string().min(2, "Zip code must be at least 2 characters."),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
