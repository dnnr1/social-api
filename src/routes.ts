import { Router } from "express";
import authMiddleware from "./middlewares/auth.js";
import {
  createUserController,
  loginUserController,
} from "./controllers/user-controller.js";
import {
  createPostController,
  editPostController,
  getAllPostsController,
  getPostController,
} from "./controllers/post-controller.js";

const route = Router();

route.post("/register", createUserController);
route.post("/login", loginUserController);

route.use(authMiddleware);

route.post("/post", createPostController);
route.patch("/post/:id", editPostController);
route.get("/posts", getAllPostsController);
route.get("/post/:id", getPostController);

export default route;
