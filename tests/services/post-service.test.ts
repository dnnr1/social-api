import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPostService,
  editPostService,
  getAllPosts,
  getPostService,
} from "../../src/services/post-service.js";
import {
  createPostRepository,
  editPostRepository,
  findPostByIdRepository,
  findPostsByUserIdRepository,
} from "../../src/repositories/post-repository.js";
import { findUserByIdRepository } from "../../src/repositories/user-repository.js";
import { HTTP_NOT_FOUND } from "../../src/constants/httpStatus.js";

vi.mock("../../src/repositories/post-repository.js", () => ({
  createPostRepository: vi.fn(),
  editPostRepository: vi.fn(),
  findPostByIdRepository: vi.fn(),
  findPostsByUserIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/user-repository.js", () => ({
  findUserByIdRepository: vi.fn(),
}));

const baseUser = { id: "user-1" };
const basePost = {
  id: "post-1",
  userId: "user-1",
  content: "Hello",
  media: "media-1",
  visibility: "public",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("post-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when post is missing", async () => {
    vi.mocked(findPostByIdRepository).mockResolvedValue(null);

    await expect(getPostService("post-1")).rejects.toMatchObject({
      statusCode: HTTP_NOT_FOUND,
    });
  });

  it("returns a post when found", async () => {
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);

    const result = await getPostService("post-1");

    expect(result).toEqual(basePost);
  });

  it("throws when user is missing for list", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(null);

    await expect(getAllPosts("user-1")).rejects.toMatchObject({
      statusCode: HTTP_NOT_FOUND,
    });
  });

  it("returns posts for an existing user", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostsByUserIdRepository).mockResolvedValue([basePost as any]);

    const result = await getAllPosts("user-1");

    expect(result).toEqual([basePost]);
  });

  it("creates a post when user exists", async () => {
    const createData = {
      userId: "user-1",
      content: "Hello",
      media: "media-1",
    };

    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(createPostRepository).mockResolvedValue(basePost as any);

    const result = await createPostService(createData);

    expect(createPostRepository).toHaveBeenCalledWith(createData);
    expect(result).toEqual(basePost);
  });

  it("throws when editing a missing post", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostByIdRepository).mockResolvedValue(null);

    await expect(
      editPostService({
        id: "post-1",
        userId: "user-1",
        content: "Updated",
      }),
    ).rejects.toMatchObject({ statusCode: HTTP_NOT_FOUND });
  });

  it("edits a post when user and post exist", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(baseUser as any);
    vi.mocked(findPostByIdRepository).mockResolvedValue(basePost as any);
    vi.mocked(editPostRepository).mockResolvedValue({
      ...basePost,
      content: "Updated",
    } as any);

    const result = await editPostService({
      id: "post-1",
      userId: "user-1",
      content: "Updated",
    });

    expect(editPostRepository).toHaveBeenCalledWith({
      id: "post-1",
      userId: "user-1",
      content: "Updated",
    });
    expect(result.content).toBe("Updated");
  });
});
