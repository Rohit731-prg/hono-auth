import { Hono } from "hono";
import { authMiddleware } from "../Middleware/auth";
import { createAddress, getAllAddress } from "../Service/AddressService";

const router = new Hono();

router.post("/create", authMiddleware, createAddress);
router.get("all", authMiddleware, getAllAddress);

export default router;