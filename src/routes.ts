import { Router } from "express";
import authMiddleware from "./middlewares/auth.js";
import { validateUuidParam } from "./middlewares/validateUuid.js";
import {
  createUserController,
  loginUserController,
  logoutUserController,
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
route.post("/logout", logoutUserController);

route.use(authMiddleware);

route.post("/post", createPostController);
route.patch("/post/:id", validateUuidParam(), editPostController);
route.get("/posts", getAllPostsController);
route.get("/post/:id", validateUuidParam(), getPostController);
route.post("/post/:id/comment", validateUuidParam(), createCommentController);
route.get("/post/:id/comments", validateUuidParam(), getPostCommentsController);
route.get("/comment/:id", validateUuidParam(), getCommentController);
route.patch("/comment/:id", validateUuidParam(), editCommentController);
route.post("/post/:id/like", validateUuidParam(), likePostController);
route.delete("/post/:id/like", validateUuidParam(), unlikePostController);
route.get("/post/:id/likes", validateUuidParam(), getPostLikesController);
route.post("/user/:id/follow", validateUuidParam(), followUserController);
route.delete("/user/:id/follow", validateUuidParam(), unfollowUserController);
route.get("/user/:id/followers", validateUuidParam(), getFollowersController);
route.get("/user/:id/following", validateUuidParam(), getFollowingController);

export default route;
