import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  createUserController,
  loginUserController,
} from "../controllers/user-controller.js";

const route = Router();

route.post("/register", createUserController);
route.post("/login", loginUserController);

route.use(authMiddleware);

route.get("/", (_, res) => {
  return res.json({ ok: true });
});

export default route;
