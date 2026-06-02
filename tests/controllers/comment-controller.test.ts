import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCommentController,
  editCommentController,
  getCommentController,
  getPostCommentsController,
} from "../../src/controllers/comment-controller.js";
import {
  createCommentService,
  editCommentService,
  getCommentService,
  getCommentsByPostService,
} from "../../src/services/comment-service.js";
import { HTTP_CREATED, HTTP_OK } from "../../src/constants/httpStatus.js";

vi.mock("../../src/services/comment-service.js", () => ({
  createCommentService: vi.fn(),
  editCommentService: vi.fn(),
  getCommentService: vi.fn(),
  getCommentsByPostService: vi.fn(),
}));

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

const baseComment = {
  id: "comment-1",
  userId: "user-1",
  postId: "post-1",
  content: "Hello",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

const baseUser = { id: "user-1" };
const basePost = { id: "post-1" };

describe("comment-controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a comment by id", async () => {
    const req = { params: { id: "comment-1" } } as any;
    const res = createRes();

    vi.mocked(getCommentService).mockResolvedValue(baseComment);

    await getCommentController(req, res);

    expect(getCommentService).toHaveBeenCalledWith("comment-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });

  it("creates a comment for a post", async () => {
    const comment = {
      id: "comment-1",
      userId: "user-1",
      postId: "post-1",
      content: "Hello",
    };

    vi.mocked(createCommentService).mockResolvedValue(comment as any);

    const req = {
      body: { content: "Hello" },
      user: { id: "user-1" },
      params: { id: "post-1" },
    } as any;
    const res = createRes();

    await createCommentController(req, res);

    expect(createCommentService).toHaveBeenCalledWith({
      content: "Hello",
      userId: "user-1",
      postId: "post-1",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
    expect(res.json).toHaveBeenCalledWith({
      code: HTTP_CREATED,
      message: "Comment created successfully!",
      data: comment,
    });
  });

  it("edits a comment", async () => {
    const req = {
      user: { id: "user-1" },
      params: { id: "comment-1" },
      body: { content: "Updated" },
    } as any;
    const res = createRes();

    vi.mocked(editCommentService).mockResolvedValue({
      ...baseComment,
      content: "Updated",
    } as any);

    await editCommentController(req, res);

    expect(editCommentService).toHaveBeenCalledWith({
      content: "Updated",
      userId: "user-1",
      id: "comment-1",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
  });

  it("returns comments for a post", async () => {
    const comments = [baseComment];

    vi.mocked(getCommentsByPostService).mockResolvedValue(comments);

    const req = { params: { id: "post-1" } } as any;
    const res = createRes();

    await getPostCommentsController(req, res);

    expect(getCommentsByPostService).toHaveBeenCalledWith("post-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });
});
