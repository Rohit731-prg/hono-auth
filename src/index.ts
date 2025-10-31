import { Hono } from 'hono'
import 'dotenv/config'
import authRoute from './Router/UserRoute';

const app = new Hono();

app.route("/auth", authRoute);

export default app;