import app from ".";
import { db_client } from "./Config/Db";

db_client.connect().then(() => {
    console.log("Database connected")
    Bun.serve({
        fetch: app.fetch,
        port: 3000
    })
}).catch((err) => {
    console.log(err)
});