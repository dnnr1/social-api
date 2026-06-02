import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/db.js";
import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
} from "../../src/repositories/user-repository.js";

vi.mock("../../src/db.js", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

const baseUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
  bio: null,
  status: "active",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("user-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user with omit password", async () => {
    const data = {
      name: "Test User",
      email: "test@example.com",
      password: "hash",
    };

    prismaMock.user.create.mockResolvedValue(baseUser as any);

    const result = await createUserRepository(data);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data,
      omit: { password: true },
    });
    expect(result).toEqual(baseUser);
  });

  it("finds a user by email", async () => {
    prismaMock.user.findUnique.mockResolvedValue(baseUser as any);

    const result = await findUserByEmailRepository("test@example.com");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(result).toEqual(baseUser);
  });

  it("finds a user by id", async () => {
    prismaMock.user.findUnique.mockResolvedValue(baseUser as any);

    const result = await findUserByIdRepository("user-1");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
    expect(result).toEqual(baseUser);
  });
});
