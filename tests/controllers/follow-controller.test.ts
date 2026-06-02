import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  followUserController,
  getFollowersController,
  getFollowingController,
  unfollowUserController,
} from "../../src/controllers/follow-controller.js";
import {
  followUserService,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
} from "../../src/services/follow-service.js";
import { HTTP_CREATED, HTTP_OK } from "../../src/constants/httpStatus.js";

vi.mock("../../src/services/follow-service.js", () => ({
  followUserService: vi.fn(),
  getFollowersService: vi.fn(),
  getFollowingService: vi.fn(),
  unfollowUserService: vi.fn(),
}));

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

describe("follow-controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("follows a user", async () => {
    const follow = {
      followerId: "user-1",
      followingId: "user-2",
    };

    vi.mocked(followUserService).mockResolvedValue(follow as any);

    const req = {
      user: { id: "user-1" },
      params: { id: "user-2" },
    } as any;
    const res = createRes();

    await followUserController(req, res);

    expect(followUserService).toHaveBeenCalledWith("user-1", "user-2");
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
  });

  it("returns followers for a user", async () => {
    const followers = [{ followerId: "user-1", followingId: "user-2" }];

    vi.mocked(getFollowersService).mockResolvedValue(followers as any);

    const req = { params: { id: "user-2" } } as any;
    const res = createRes();

    await getFollowersController(req, res);

    expect(getFollowersService).toHaveBeenCalledWith("user-2");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });

  it("returns following for a user", async () => {
    const following = [{ followerId: "user-1", followingId: "user-2" }];

    vi.mocked(getFollowingService).mockResolvedValue(following as any);

    const req = { params: { id: "user-1" } } as any;
    const res = createRes();

    await getFollowingController(req, res);

    expect(getFollowingService).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });

  it("unfollows a user", async () => {
    const follow = { followerId: "user-1", followingId: "user-2" };

    vi.mocked(unfollowUserService).mockResolvedValue(follow as any);

    const req = {
      user: { id: "user-1" },
      params: { id: "user-2" },
    } as any;
    const res = createRes();

    await unfollowUserController(req, res);

    expect(unfollowUserService).toHaveBeenCalledWith("user-1", "user-2");
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);
  });
});
