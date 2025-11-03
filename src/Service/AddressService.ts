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
    if (!perse.success) return c.json({ message: "all requerment is essentional"}, 404);
    try {
        const user_exist = await user_collection.findOne({ _id: new ObjectId(user)});
        if (!user_exist) return c.json({ message: "user not found"});

        await address_collection.insertOne({
            street, city, state, user
        });
        return c.json({ message: "address added "}, 201);
    } catch (error: any) {
        c.json({ message: error.message}, 500)
    }
}

export const getAllAddress = async (c: Context) => {
    try {
        const all_address = address_collection.aggregate([
            {
                $lookup: {
                    from: "users",           // name of the user collection
                    localField: "user",      // field in address_collection (user ID)
                    foreignField: "_id",     // field in user_collection
                    as: "user"               // alias for joined data
                }
            },
            {
                $unwind: "$user"           // flatten user array
            }
        ]);
        if (!all_address) return c.json({ message: "no address fonund "}, 404);

        c.json(all_address)
    } catch (error: any) {
        c.json({ message: error.message });
    }
}