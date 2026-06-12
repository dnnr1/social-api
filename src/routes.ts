import { Router } from "express";
import authMiddleware from "./middlewares/auth.js";
import { validateUuidParam } from "./middlewares/validateUuid.js";
import { paginationMiddleware } from "./middlewares/pagination.js";
import {
  createUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
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
import {
  followUserController,
  getFollowersController,
  getFollowingController,
  unfollowUserController,
} from "./controllers/follow-controller.js";
import {
  getPostLikesController,
  likePostController,
  unlikePostController,
} from "./controllers/like-controller.js";

const route = Router();

route.post("/register", createUserController);
route.post("/login", loginUserController);

const authRoute = Router();
authRoute.post("/refresh", refreshTokenController);
route.use("/auth", authRoute);

route.use(authMiddleware);

route.post("/logout", logoutUserController);

route.post("/post", createPostController);
route.patch("/post/:id", validateUuidParam(), editPostController);
route.get("/posts", paginationMiddleware(), getAllPostsController);
route.get("/post/:id", validateUuidParam(), getPostController);
route.post("/post/:id/comment", validateUuidParam(), createCommentController);
route.get("/post/:id/comments", validateUuidParam(), paginationMiddleware(), getPostCommentsController);
route.get("/comment/:id", validateUuidParam(), getCommentController);
route.patch("/comment/:id", validateUuidParam(), editCommentController);
route.post("/post/:id/like", validateUuidParam(), likePostController);
route.delete("/post/:id/like", validateUuidParam(), unlikePostController);
route.get("/post/:id/likes", validateUuidParam(), paginationMiddleware(), getPostLikesController);
route.post("/user/:id/follow", validateUuidParam(), followUserController);
route.delete("/user/:id/follow", validateUuidParam(), unfollowUserController);
route.get("/user/:id/followers", validateUuidParam(), paginationMiddleware(), getFollowersController);
route.get("/user/:id/following", validateUuidParam(), paginationMiddleware(), getFollowingController);

export default route;
