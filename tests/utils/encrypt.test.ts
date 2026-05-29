import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcrypt";
import encrypt from "../../src/utils/encrypt.js";

vi.mock("bcrypt");

describe("encrypt", () => {
  it("should hash value", async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed_value" as any);

    const result = await encrypt("123");

    expect(bcrypt.hash).toHaveBeenCalledWith("123", 10);
    expect(result).toBe("hashed_value");
  });
});
