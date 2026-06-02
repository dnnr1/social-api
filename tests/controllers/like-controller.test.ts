import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPostLikesController,
  likePostController,
  unlikePostController,
} from "../../src/controllers/like-controller.js";
import {
  getPostLikesService,
  likePostService,
  unlikePostService,
} from "../../src/services/like-service.js";
import { HTTP_CREATED, HTTP_OK } from "../../src/constants/httpStatus.js";

vi.mock("../../src/services/like-service.js", () => ({
  getPostLikesService: vi.fn(),
  likePostService: vi.fn(),
  unlikePostService: vi.fn(),
}));

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

describe("like-controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("likes a post", async () => {
    const like = { userId: "user-1", postId: "post-1" };

    vi.mocked(likePostService).mockResolvedValue(like as any);

    const req = {
      user: { id: "user-1" },
      params: { id: "post-1" },
    } as any;
    const res = createRes();

    await likePostController(req, res);

    expect(likePostService).toHaveBeenCalledWith("user-1", "post-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
  });

  it("returns likes for a post", async () => {
    const likes = [{ userId: "user-1", postId: "post-1" }];

    vi.mocked(getPostLikesService).mockResolvedValue(likes as any);

    const req = { params: { id: "post-1" } } as any;
    const res = createRes();

    await getPostLikesController(req, res);

    expect(getPostLikesService).toHaveBeenCalledWith("post-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });

  it("unlikes a post", async () => {
    const like = { userId: "user-1", postId: "post-1" };

    vi.mocked(unlikePostService).mockResolvedValue(like as any);

    const req = {
      user: { id: "user-1" },
      params: { id: "post-1" },
    } as any;
    const res = createRes();

    await unlikePostController(req, res);

    expect(unlikePostService).toHaveBeenCalledWith("user-1", "post-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });
});
