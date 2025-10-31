import { sign } from "hono/jwt"

type JWTPayload = {
  [key: string]: string | number | boolean | object | null;
};

export const generate_token = async (payload: JWTPayload) => {
    const key = process.env.JWT_SECRET;
    if (!key) return false;
    return await sign(payload, key);
}