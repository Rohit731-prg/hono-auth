import { Hono } from "hono";
import { loginService } from "../Service/UserService";

const authRoute = new Hono();

authRoute.post("/login", loginService);

export default authRoute;