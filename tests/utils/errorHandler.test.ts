import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import errorHandler from "../../src/utils/errorHandler.js";
import AppError from "../../src/appError.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
} from "../../src/constants/httpStatus.js";

function createRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

describe("errorHandler", () => {
  it("returns validation errors for Zod failures", () => {
    const schema = z.object({ name: z.string() });
    const result = schema.safeParse({});
    const res = createRes();

    errorHandler(result.error!, {} as any, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(HTTP_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: false,
        status: HTTP_BAD_REQUEST,
        message: "Validation error",
      }),
    );
  });

  it("returns AppError payloads", () => {
    const res = createRes();

    errorHandler(
      new AppError("Not found", HTTP_NOT_FOUND),
      {} as any,
      res,
      vi.fn() as any,
    );

    expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      status: HTTP_NOT_FOUND,
      message: "Not found",
    });
  });

  it("returns 500 for unknown errors", () => {
    const res = createRes();

    errorHandler(new Error("Boom"), {} as any, res, vi.fn() as any);

    expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      status: HTTP_INTERNAL_SERVER_ERROR,
      message: "Boom",
    });
  });
});
