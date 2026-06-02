import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPostLikesService,
  likePostService,
  unlikePostService,
} from "../../src/services/like-service.js";
import {
  createLikeRepository,
  findLikeRepository,
  findLikesByPostIdRepository,
} from "../../src/repositories/like-repository.js";
import { findPostByIdRepository } from "../../src/repositories/post-repository.js";
import { findUserByIdRepository } from "../../src/repositories/user-repository.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
} from "../../src/constants/httpStatus.js";

vi.mock("../../src/repositories/like-repository.js", () => ({
  createLikeRepository: vi.fn(),
  deleteLikeRepository: vi.fn(),
  findLikeRepository: vi.fn(),
  findLikesByPostIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/post-repository.js", () => ({
  findPostByIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/user-repository.js", () => ({
  findUserByIdRepository: vi.fn(),
}));

const baseLike = {
  userId: "user-1",
  postId: "post-1",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

const baseUser = { id: "user-1" };
const basePost = { id: "post-1" };

describe("like-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when post is already liked", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);
    vi.mocked(findLikeRepository).mockResolvedValue(baseLike as any);

    await expect(likePostService("user-1", "post-1")).rejects.toMatchObject({
      statusCode: HTTP_BAD_REQUEST,
    });
  });

  it("creates a like when valid", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);
    vi.mocked(findLikeRepository).mockResolvedValue(null);
    vi.mocked(createLikeRepository).mockResolvedValue(baseLike as any);

    const result = await likePostService("user-1", "post-1");

    expect(createLikeRepository).toHaveBeenCalledWith({
      userId: "user-1",
      postId: "post-1",
    });
    expect(result).toEqual(baseLike);
  });

  it("throws when unliking a missing like", async () => {
    vi.mocked(findLikeRepository).mockResolvedValue(null);

    await expect(unlikePostService("user-1", "post-1")).rejects.toMatchObject({
      statusCode: HTTP_NOT_FOUND,
    });
  });

  it("returns likes for an existing post", async () => {
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);
    vi.mocked(findLikesByPostIdRepository).mockResolvedValue([baseLike as any]);

    const result = await getPostLikesService("post-1");

    expect(result).toEqual([baseLike]);
  });
});
