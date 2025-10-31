import { MiddlewareHandler } from "hono";
import { verify } from 'hono/jwt'
import { getCookie } from 'hono/cookie'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({ message: "UnauerUnauthorized"}, 400);

    try {
        const payload = await verify(token, process.env.JWT_SECRET!);
        c.set('user', payload);
        await next();
    } catch (error: any) {
        return c.json({ message: error.message }, 500);
    }
}