import { z } from "zod"

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
    user: z.object({
        _id: z.string(),
        name: z.string(),
        email: z.string().email(),
    })
})