import { Hono } from 'hono'
import 'dotenv/config'
import authRoute from './Router/UserRoute';
import addressRoute from './Router/AddressRoute';

const app = new Hono();

app.route("/auth", authRoute);
app.route("/address", addressRoute);

export default app;