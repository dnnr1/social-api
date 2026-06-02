import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUserService,
  loginUserService,
} from "../../src/services/user-service.js";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../../src/repositories/user-repository.js";
import encrypt from "../../src/utils/encrypt.js";
import decrypt from "../../src/utils/decrypt.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
} from "../../src/constants/httpStatus.js";

vi.mock("../../src/repositories/user-repository.js", () => ({
  createUserRepository: vi.fn(),
  findUserByEmailRepository: vi.fn(),
}));

vi.mock("../../src/utils/encrypt.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../src/utils/decrypt.js", () => ({
  default: vi.fn(),
}));

const baseUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  password: "hash",
  role: "user",
  bio: null,
  status: "active",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("user-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when email is already in use", async () => {
    vi.mocked(findUserByEmailRepository).mockResolvedValue(baseUser as any);

    await expect(
      createUserService({
        name: "Test User",
        email: "test@example.com",
        password: "secret",
      }),
    ).rejects.toMatchObject({ statusCode: HTTP_BAD_REQUEST });
  });

  it("creates a user with a hashed password", async () => {
    const hashedPassword = "hashed";

    vi.mocked(findUserByEmailRepository).mockResolvedValue(null);
    vi.mocked(encrypt).mockResolvedValue(hashedPassword as any);
    vi.mocked(createUserRepository).mockResolvedValue({
      ...baseUser,
      password: hashedPassword,
    } as any);

    const result = await createUserService({
      name: "Test User",
      email: "test@example.com",
      password: "secret",
    });

    expect(encrypt).toHaveBeenCalledWith("secret");
    expect(createUserRepository).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });
    expect(result.password).toBe(hashedPassword);
  });

  it("throws when user is not found on login", async () => {
    vi.mocked(findUserByEmailRepository).mockResolvedValue(null);

    await expect(
      loginUserService({
        email: "missing@example.com",
        password: "secret",
      }),
    ).rejects.toMatchObject({ statusCode: HTTP_NOT_FOUND });
  });

  it("throws when password is incorrect", async () => {
    vi.mocked(findUserByEmailRepository).mockResolvedValue(baseUser as any);
    vi.mocked(decrypt).mockResolvedValue(false as any);

    await expect(
      loginUserService({
        email: "test@example.com",
        password: "wrong",
      }),
    ).rejects.toMatchObject({ statusCode: HTTP_BAD_REQUEST });
  });

  it("returns user when login succeeds", async () => {
    vi.mocked(findUserByEmailRepository).mockResolvedValue(baseUser as any);
    vi.mocked(decrypt).mockResolvedValue(true as any);

    const result = await loginUserService({
      email: "test@example.com",
      password: "secret",
    });

    expect(result).toEqual(baseUser);
  });
});
