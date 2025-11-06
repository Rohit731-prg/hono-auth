import { Context } from "hono";
import { AddressSchema } from "../Model/AdressModel";
import { address_collection, user_collection } from "../Config/Db";
import { ObjectId } from "mongodb";

export const createAddress = async (c: Context) => {
    const { street, city, state, user } = await c.req.json();
    const perse = AddressSchema.pick({
        street: true,
        city: true,
        state: true,
        user: true
    }).safeParse({
        street, city, state, user
    });
    if (!perse.success) return c.json({ message: "all requerment is essentional" }, 404);
    try {
        const user_exist = await user_collection.findOne({ _id: new ObjectId(user) });
        if (!user_exist) return c.json({ message: "user not found" });

        const user_id = new ObjectId(user);
        await address_collection.insertOne({
            street, city, state, user: user_id
        });
        return c.json({ message: "address added " }, 201);
    } catch (error: any) {
        c.json({ message: error.message }, 500)
    }
}

export const getAllAddress = async (c: Context) => {
    try {
        const all_address = await address_collection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }
        ]).toArray();

        
        if (!all_address.length)
            return c.json({ message: "No address found" }, 404);

        return c.json(all_address); // ✅ MUST return
    } catch (error: any) {
        return c.json({ message: error.message }, 500); // ✅ MUST return
    }
}