import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/db.js";
import {
  createPostRepository,
  editPostRepository,
  findPostByIdRepository,
  findPostsByUserIdRepository,
} from "../../src/repositories/post-repository.js";

vi.mock("../../src/db.js", () => ({
  prisma: {
    post: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

const basePost = {
  id: "post-1",
  userId: "user-1",
  content: "Hello",
  media: "media-1",
  visibility: "public",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("post-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a post", async () => {
    const data = {
      userId: "user-1",
      content: "Hello",
      media: "media-1",
    };

    prismaMock.post.create.mockResolvedValue(basePost as any);

    const result = await createPostRepository(data);

    expect(prismaMock.post.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(basePost);
  });

  it("edits a post", async () => {
    prismaMock.post.update.mockResolvedValue(basePost as any);

    const result = await editPostRepository({
      id: "post-1",
      userId: "user-1",
      content: "Updated",
      media: "media-1",
      visibility: "private",
    });

    expect(prismaMock.post.update).toHaveBeenCalledWith({
      where: { id: "post-1" },
      data: { content: "Updated", media: "media-1", visibility: "private" },
    });
    expect(result).toEqual(basePost);
  });

  it("finds a post by id", async () => {
    prismaMock.post.findUnique.mockResolvedValue(basePost as any);

    const result = await findPostByIdRepository("post-1");

    expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
      where: { id: "post-1" },
    });
    expect(result).toEqual(basePost);
  });

  it("finds posts by user id", async () => {
    prismaMock.post.findMany.mockResolvedValue([basePost] as any);

    const result = await findPostsByUserIdRepository("user-1");

    expect(prismaMock.post.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    });
    expect(result).toEqual([basePost]);
  });
});
