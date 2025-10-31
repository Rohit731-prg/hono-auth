import { z } from "zod";

export const UserSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6).max(8),
    image: z.string(),
    otp: z.string(),
    auth: z.boolean()
});