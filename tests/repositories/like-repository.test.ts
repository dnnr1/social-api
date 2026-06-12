import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/db.js";
import {
  createLikeRepository,
  deleteLikeRepository,
  findLikeRepository,
  findLikesByPostIdRepository,
} from "../../src/repositories/like-repository.js";

vi.mock("../../src/db.js", () => ({
  prisma: {
    like: {
      create: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

const baseLike = {
  userId: "user-1",
  postId: "post-1",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("like-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a like", async () => {
    prismaMock.like.create.mockResolvedValue(baseLike as any);

    const result = await createLikeRepository({
      userId: "user-1",
      postId: "post-1",
    });

    expect(prismaMock.like.create).toHaveBeenCalledWith({
      data: { userId: "user-1", postId: "post-1" },
    });
    expect(result).toEqual(baseLike);
  });

  it("deletes a like", async () => {
    prismaMock.like.delete.mockResolvedValue(baseLike as any);

    const result = await deleteLikeRepository({
      userId: "user-1",
      postId: "post-1",
    });

    expect(prismaMock.like.delete).toHaveBeenCalledWith({
      where: { userId_postId: { userId: "user-1", postId: "post-1" } },
    });
    expect(result).toEqual(baseLike);
  });

  it("finds a like", async () => {
    prismaMock.like.findUnique.mockResolvedValue(baseLike as any);

    const result = await findLikeRepository({
      userId: "user-1",
      postId: "post-1",
    });

    expect(prismaMock.like.findUnique).toHaveBeenCalledWith({
      where: { userId_postId: { userId: "user-1", postId: "post-1" } },
    });
    expect(result).toEqual(baseLike);
  });

  it("finds likes by post id", async () => {
    prismaMock.like.findMany.mockResolvedValue([baseLike] as any);

    const result = await findLikesByPostIdRepository("post-1");

    expect(prismaMock.like.findMany).toHaveBeenCalledWith({
      where: { postId: "post-1" },
      skip: 0,
      take: 20,
      orderBy: { created_at: "desc" },
    });
    expect(result).toEqual([baseLike]);
  });
});
