import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUserController,
  loginUserController,
} from "../../src/controllers/user-controller.js";
import {
  createUserService,
  loginUserService,
} from "../../src/services/user-service.js";
import { HTTP_CREATED, HTTP_OK } from "../../src/constants/httpStatus.js";

vi.mock("../../src/services/user-service.js", () => ({
  createUserService: vi.fn(),
  loginUserService: vi.fn(),
}));

vi.mock("../../src/utils/tokenGenerate.js", () => ({
  generateTokens: vi.fn(() => Promise.resolve({
    accessToken: "access-token",
    refreshToken: "refresh-token",
  })),
  verifyRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
}));

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  } as any;
}

describe("user-controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user and sets a cookie", async () => {
    const createdUser = { id: "user-1", role: "user" };

    vi.mocked(createUserService).mockResolvedValue(createdUser as any);

    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "secret",
      },
    } as any;
    const res = createRes();

    await createUserController(req, res);

    expect(createUserService).toHaveBeenCalledWith(req.body);
    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledWith(
      "access_token",
      "access-token",
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
    expect(res.json).toHaveBeenCalledWith({
      code: HTTP_CREATED,
      message: "User created successfully!",
      data: createdUser,
    });
  });

  it("logs in a user and hides the password", async () => {
    const user = {
      id: "user-1",
      role: "user",
      password: "hash",
    };

    vi.mocked(loginUserService).mockResolvedValue(user as any);

    const req = {
      body: {
        email: "test@example.com",
        password: "secret",
      },
    } as any;
    const res = createRes();

    await loginUserController(req, res);

    expect(loginUserService).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(HTTP_OK);

    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.data.password).toBeUndefined();
  });
});
