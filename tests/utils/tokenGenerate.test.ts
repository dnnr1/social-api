import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken");

describe("tokenGenerate", () => {
  it("should generate a token", async () => {
    vi.mocked(jwt.sign).mockReturnValue("token" as any);

    const { generateAccessToken } = await import("../../src/utils/tokenGenerate.js");

    const result = generateAccessToken({ id: "user-1", role: "user" });

    expect(jwt.sign).toHaveBeenCalledWith({ id: "user-1", role: "user" }, expect.any(String), { expiresIn: "15m" });

    expect(result).toBe("token");
  });
});
