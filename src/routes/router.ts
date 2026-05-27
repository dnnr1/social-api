import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  createUserController,
  loginUserController,
} from "../controllers/user-controller.js";
import { createPostController } from "../controllers/post-controller.js";

const route = Router();

route.post("/register", createUserController);
route.post("/login", loginUserController);

route.use(authMiddleware);

route.post("/post/create-post", createPostController);

route.get("/", (_, res) => {
  return res.json({ ok: true });
});

export default route;
