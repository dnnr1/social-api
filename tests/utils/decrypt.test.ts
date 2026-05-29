import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcrypt";
import decrypt from "../../src/utils/decrypt.js";

vi.mock("bcrypt");

describe("decrypt", () => {
  it("should return true when password matches", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

    const result = await decrypt("123", "hash");

    expect(bcrypt.compare).toHaveBeenCalledWith("123", "hash");
    expect(result).toBe(true);
  });
});
