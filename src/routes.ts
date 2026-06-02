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
import {
  createCommentController,
  editCommentController,
  getCommentController,
  getPostCommentsController,
} from "./controllers/comment-controller.js";

const route = Router();

route.post("/register", createUserController);
route.post("/login", loginUserController);

route.use(authMiddleware);

route.post("/post", createPostController);
route.patch("/post/:id", editPostController);
route.get("/posts", getAllPostsController);
route.get("/post/:id", getPostController);
route.post("/post/:id/comment", createCommentController);
route.get("/post/:id/comments", getPostCommentsController);
route.get("/comment/:id", getCommentController);
route.patch("/comment/:id", editCommentController);

export default route;
