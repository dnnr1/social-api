import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPostController,
  editPostController,
  getAllPostsController,
  getPostController,
} from "../../src/controllers/post-controller.js";
import {
  createPostService,
  editPostService,
  getAllPosts,
  getPostService,
} from "../../src/services/post-service.js";
import { HTTP_CREATED, HTTP_OK } from "../../src/constants/httpStatus.js";

vi.mock("../../src/services/post-service.js", () => ({
  createPostService: vi.fn(),
  editPostService: vi.fn(),
  getAllPosts: vi.fn(),
  getPostService: vi.fn(),
}));

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

const basePost = {
  id: "post-1",
  userId: "user-1",
  content: "Hello",
  media: "media-1",
  visibility: "public",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("post-controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all posts for the current user", async () => {
    const req = { user: { id: "user-1" } } as any;
    const res = createRes();

    vi.mocked(getAllPosts).mockResolvedValue([basePost]);

    await getAllPostsController(req, res);

    expect(getAllPosts).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
    expect(res.json).toHaveBeenCalledWith({
      code: HTTP_OK,
      message: "Posts retrieved successfully!",
      data: [basePost],
    });
  });

  it("creates a post for the authenticated user", async () => {
    const post = {
      id: "post-1",
      userId: "user-1",
      content: "Hello",
      media: "media-1",
    };

    vi.mocked(createPostService).mockResolvedValue(post as any);

    const req = {
      body: { content: "Hello", media: "media-1" },
      user: { id: "user-1" },
    } as any;
    const res = createRes();

    await createPostController(req, res);

    expect(createPostService).toHaveBeenCalledWith({
      content: "Hello",
      media: "media-1",
      userId: "user-1",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
    expect(res.json).toHaveBeenCalledWith({
      code: HTTP_CREATED,
      message: "Post created successfully!",
      data: post,
    });
  });

  it("returns a post by id", async () => {
    const post = { ...basePost };

    vi.mocked(getPostService).mockResolvedValue(post as any);

    const req = { params: { id: "post-1" } } as any;
    const res = createRes();

    await getPostController(req, res);

    expect(getPostService).toHaveBeenCalledWith("post-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });

  it("edits a post", async () => {
    const req = {
      user: { id: "user-1" },
      params: { id: "post-1" },
      body: { content: "Updated" },
    } as any;
    const res = createRes();

    vi.mocked(editPostService).mockResolvedValue({
      ...basePost,
      content: "Updated",
    } as any);

    await editPostController(req, res);

    expect(editPostService).toHaveBeenCalledWith({
      content: "Updated",
      userId: "user-1",
      id: "post-1",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
  });
});
