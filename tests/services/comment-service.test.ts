import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCommentService,
  editCommentService,
  getCommentService,
  getCommentsByPostService,
} from "../../src/services/comment-service.js";
import {
  editCommentRepository,
  findCommentByIdRepository,
  findCommentsByPostIdRepository,
} from "../../src/repositories/comment-repository.js";
import { findPostByIdRepository } from "../../src/repositories/post-repository.js";
import { findUserByIdRepository } from "../../src/repositories/user-repository.js";
import { HTTP_NOT_FOUND } from "../../src/constants/httpStatus.js";

vi.mock("../../src/repositories/comment-repository.js", () => ({
  createCommentRepository: vi.fn(),
  editCommentRepository: vi.fn(),
  findCommentByIdRepository: vi.fn(),
  findCommentsByPostIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/post-repository.js", () => ({
  findPostByIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/user-repository.js", () => ({
  findUserByIdRepository: vi.fn(),
}));

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

describe("comment-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when comment is missing", async () => {
    vi.mocked(findCommentByIdRepository).mockResolvedValue(null);

    await expect(getCommentService("comment-1")).rejects.toMatchObject({
      statusCode: HTTP_NOT_FOUND,
    });
  });

  it("returns comments for an existing post", async () => {
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);
    vi.mocked(findCommentsByPostIdRepository).mockResolvedValue([
      baseComment as any,
    ]);

    const result = await getCommentsByPostService("post-1");

    expect(result).toEqual([baseComment]);
  });

  it("throws when creating a comment for a missing post", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostByIdRepository).mockResolvedValue(null);

    await expect(
      createCommentService({
        userId: "user-1",
        postId: "post-1",
        content: "Hello",
      }),
    ).rejects.toMatchObject({ statusCode: HTTP_NOT_FOUND });
  });

  it("updates a comment when user and comment exist", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findCommentByIdRepository).mockResolvedValue(baseComment as any);
    vi.mocked(editCommentRepository).mockResolvedValue({
      ...baseComment,
      content: "Updated",
    } as any);

    const result = await editCommentService({
      id: "comment-1",
      userId: "user-1",
      content: "Updated",
    });

    expect(editCommentRepository).toHaveBeenCalledWith({
      id: "comment-1",
      userId: "user-1",
      content: "Updated",
    });
    expect(result.content).toBe("Updated");
  });
});
