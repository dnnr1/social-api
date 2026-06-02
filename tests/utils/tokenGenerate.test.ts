import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import tokenGenerate from "../../src/utils/tokenGenerate.js";

vi.mock("jsonwebtoken");

describe("tokenGenerate", () => {
  it("should generate a token", async () => {
    vi.mocked(jwt.sign).mockReturnValue("token" as any);

    process.env.JWT_SECRET = "secret";

    const result = tokenGenerate({ data: "123" });

    expect(jwt.sign).toHaveBeenCalledWith({ data: "123" }, "secret");

    expect(result).toBe("token");
  });
});
