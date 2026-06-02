import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/db.js";
import {
  createFollowRepository,
  deleteFollowRepository,
  findFollowRepository,
  findFollowersByUserIdRepository,
  findFollowingByUserIdRepository,
} from "../../src/repositories/follow-repository.js";

vi.mock("../../src/db.js", () => ({
  prisma: {
    follow: {
      create: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

const baseFollow = {
  followerId: "user-1",
  followingId: "user-2",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("follow-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a follow", async () => {
    prismaMock.follow.create.mockResolvedValue(baseFollow as any);

    const result = await createFollowRepository({
      followerId: "user-1",
      followingId: "user-2",
    });

    expect(prismaMock.follow.create).toHaveBeenCalledWith({
      data: { followerId: "user-1", followingId: "user-2" },
    });
    expect(result).toEqual(baseFollow);
  });

  it("deletes a follow", async () => {
    prismaMock.follow.delete.mockResolvedValue(baseFollow as any);

    const result = await deleteFollowRepository({
      followerId: "user-1",
      followingId: "user-2",
    });

    expect(prismaMock.follow.delete).toHaveBeenCalledWith({
      where: {
        followerId_followingId: { followerId: "user-1", followingId: "user-2" },
      },
    });
    expect(result).toEqual(baseFollow);
  });

  it("finds a follow", async () => {
    prismaMock.follow.findUnique.mockResolvedValue(baseFollow as any);

    const result = await findFollowRepository({
      followerId: "user-1",
      followingId: "user-2",
    });

    expect(prismaMock.follow.findUnique).toHaveBeenCalledWith({
      where: {
        followerId_followingId: { followerId: "user-1", followingId: "user-2" },
      },
    });
    expect(result).toEqual(baseFollow);
  });

  it("finds followers by user id", async () => {
    prismaMock.follow.findMany.mockResolvedValue([baseFollow] as any);

    const result = await findFollowersByUserIdRepository("user-2");

    expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
      where: { followingId: "user-2" },
    });
    expect(result).toEqual([baseFollow]);
  });

  it("finds following by user id", async () => {
    prismaMock.follow.findMany.mockResolvedValue([baseFollow] as any);

    const result = await findFollowingByUserIdRepository("user-1");

    expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
      where: { followerId: "user-1" },
    });
    expect(result).toEqual([baseFollow]);
  });
});
