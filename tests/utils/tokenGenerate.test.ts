import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../src/utils/tokenGenerate.js";

vi.mock("../../src/config/index.js", () => ({
  config: {
    jwtSecret: "test-secret",
    nodeEnv: "test",
    port: 8080,
    corsOrigin: ["http://localhost:3000"],
    databaseUrl: "mysql://localhost:3306/test",
    bcryptSaltRounds: 10,
  },
}));

vi.mock("jsonwebtoken");

describe("tokenGenerate", () => {
  it("should generate a token", () => {
    vi.mocked(jwt.sign).mockReturnValue("token" as any);

    const result = generateAccessToken({ id: "user-1", role: "user" });

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user-1", role: "user" },
      "test-secret",
      { expiresIn: "15m" },
    );

    expect(result).toBe("token");
  });
});
