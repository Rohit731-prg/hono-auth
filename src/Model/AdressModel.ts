import { z } from "zod"
import { UserSchema } from "./UserModel";

export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    user: z.string() 
});

export const all_addressSchemas = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    user: UserSchema
})