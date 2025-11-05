import { Hono } from "hono";
import {
    getAllUsers,
    loginService,
    logoutService,
    SignUp,
    verifyUser
} from "../Service/UserService";
import { authMiddleware } from "../Middleware/auth";

const authRoute = new Hono();

authRoute.post("/login", loginService);
authRoute.post("/signup", SignUp);
authRoute.post("/verify/:id", verifyUser);
authRoute.get("/users", authMiddleware, getAllUsers);
authRoute.get("/logout", logoutService);

export default authRoute;