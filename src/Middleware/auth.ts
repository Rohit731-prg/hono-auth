import { MiddlewareHandler } from "hono";
import { verify } from 'hono/jwt'
import { getCookie } from 'hono/cookie'
import { user_collection } from "../Config/Db";
import { ObjectId } from "mongodb";


interface JwtPayload {
    id: string;
    auth: boolean;
    iat: number;
    exp: number;
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({ message: "UnauerUnauthorized"}, 400);

    try {
        const payload = await verify(token, process.env.JWT_SECRET!) as unknown as JwtPayload;
        if (!payload) return c.json({ message: "Invalid Token"}, 400);
        if (payload.auth === false) return c.json({ message: "please verify your email"}, 400);
        const id = payload.id;
        console.log("Payload ID:", id);
        const user = await user_collection.findOne({ _id: new ObjectId(id) });
        if (!user) return c.json({ message: "user not found"}, 404);
        c.set('user', payload);
        console.log("Authenticated User:", user);
        return await next();
    } catch (error: any) {
        console.error("Authentication Error:", error);
        return c.json({ message: error.message }, 500);
    }
}