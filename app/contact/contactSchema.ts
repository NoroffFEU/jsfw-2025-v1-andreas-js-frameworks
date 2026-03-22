import { z } from "zod";

export const ContactSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  email: z.email("Enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
