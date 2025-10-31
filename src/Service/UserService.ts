import { Context } from "hono"
import { generateHash, verifyHash } from "../Utils/hash";
import { user_collection } from "../Config/Db";
import { generate_token } from "../Utils/token_generate";
import { setCookie } from "hono/cookie";
import { UserSchema } from "../Model/UserModel";
import { ObjectId } from "mongodb";

export const loginService = async (c: Context) => {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ message: "email and password is essansitial"}, 404);

    try {
        const user = await user_collection.findOne({ email });
        if (!user) return c.json({ message: "User not fonnd" }, 404);
        const is_match = verifyHash(password, user.password);
        if (!is_match) return c.json({ message: "password is not matching" }, 404);

        const token = await generate_token({
            id: user._id.toString(),
            email: user.email,
            auth: user.auth
        });
        if (!token) return c.json({ message: "token generating error" }, 404);
        setCookie(c, "toekn", token);

        c.json({
            message: "Login successful",
            user: user
        })
    } catch (error: any) {
        c.json({ message: error.message }, 500)
    }
}

export const SignUp = async (c: Context) => {
    const { name, email, password } = await c.req.json();
    const parse = UserSchema.pick({ name: true, email: true, password: true })
        .safeParse({ name, email, password });
    if (!parse.success) return c.json({ message: parse.error.message }, 404);
    try {
        const is_exist = await user_collection.findOne({ email });
        if (is_exist) return c.json({ message: "User already exist" }, 404);

        const hashedPassword = await generateHash(password);
        const otp = Math.floor(Math.random() * 10000);
        await user_collection.insertOne({
            name,
            email,
            password: hashedPassword,
            otp: otp,
            auth: false
        });

        c.json({ message: "User created successfully", })
    } catch (error: any) {
        c.json({ message: error.message }, 500)
    }
}

export const verifyUser = async (c: Context) => {
    const { id } = c.req.param();
    const { otp } = await c.req.json();
    if (!id || !otp) return c.json({ message: "all data are essansitial"}, 404);

    try {
        const user = await user_collection.findOne({ _id: new ObjectId(id) });
        if (!user) return c.json({ message: "User not found" }, 404);

        if (user.otp !== otp) return c.json({ message: "otp is not matching" }, 404);

        await user_collection.updateOne({ _id: new ObjectId(id) }, { $set: { auth: true } });
        c.json({ message: "User verified successfully" });
    } catch (error: any) {
        c.json({ message: error.message }, 500);
    }
}

export const getAllUsers = async (c: Context) => {
    try {
        const users = await user_collection.find({}).toArray();
        if (!users) return c.json({ message: "User not found" }, 404);
        c.json({ message: "User found successfully", users });
    } catch (error: any) {
        c.json({ message: error.message }, 500)
    }
}