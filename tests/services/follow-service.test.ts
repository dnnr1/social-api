import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  followUserService,
  getFollowersService,
  unfollowUserService,
} from "../../src/services/follow-service.js";
import {
  createFollowRepository,
  findFollowRepository,
  findFollowersByUserIdRepository,
} from "../../src/repositories/follow-repository.js";
import { findUserByIdRepository } from "../../src/repositories/user-repository.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
} from "../../src/constants/httpStatus.js";

vi.mock("../../src/repositories/follow-repository.js", () => ({
  createFollowRepository: vi.fn(),
  deleteFollowRepository: vi.fn(),
  findFollowRepository: vi.fn(),
  findFollowersByUserIdRepository: vi.fn(),
  findFollowingByUserIdRepository: vi.fn(),
}));

vi.mock("../../src/repositories/user-repository.js", () => ({
  findUserByIdRepository: vi.fn(),
}));

const follower = { id: "user-1" };
const following = { id: "user-2" };
const baseFollow = {
  followerId: "user-1",
  followingId: "user-2",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("follow-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects self-follow", async () => {
    await expect(followUserService("user-1", "user-1")).rejects.toMatchObject({
      statusCode: HTTP_BAD_REQUEST,
    });
  });

  it("creates a follow relationship when valid", async () => {
    vi.mocked(findUserByIdRepository)
      .mockResolvedValueOnce(follower as any)
      .mockResolvedValueOnce(following as any);
    vi.mocked(findFollowRepository).mockResolvedValue(null);
    vi.mocked(createFollowRepository).mockResolvedValue(baseFollow as any);

    const result = await followUserService("user-1", "user-2");

    expect(createFollowRepository).toHaveBeenCalledWith({
      followerId: "user-1",
      followingId: "user-2",
    });
    expect(result).toEqual(baseFollow);
  });

  it("throws when unfollowing a non-existent relation", async () => {
    vi.mocked(findFollowRepository).mockResolvedValue(null);

    await expect(unfollowUserService("user-1", "user-2")).rejects.toMatchObject(
      { statusCode: HTTP_NOT_FOUND },
    );
  });

  it("returns followers for an existing user", async () => {
    vi.mocked(findUserByIdRepository).mockResolvedValue(following as any);
    vi.mocked(findFollowersByUserIdRepository).mockResolvedValue([
      baseFollow as any,
    ]);

    const result = await getFollowersService("user-2");

    expect(result).toEqual([baseFollow]);
  });
});
