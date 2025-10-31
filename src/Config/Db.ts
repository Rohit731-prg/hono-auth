import { MongoClient } from "mongodb";

if (!process.env.DB_URL) {
    throw new Error("DB_URL is not defined");
}

const url = process.env.DB_URL;
const client = new MongoClient(url);
export const db_client = client;
export const db = client.db("hono-auth");

export const  user_collection = db.collection("users")