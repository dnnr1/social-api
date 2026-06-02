import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/db.js";
import {
  createCommentRepository,
  editCommentRepository,
  findCommentByIdRepository,
  findCommentsByPostIdRepository,
} from "../../src/repositories/comment-repository.js";

vi.mock("../../src/db.js", () => ({
  prisma: {
    comment: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

const baseComment = {
  id: "comment-1",
  userId: "user-1",
  postId: "post-1",
  content: "Hello",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("comment-repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a comment", async () => {
    const data = {
      userId: "user-1",
      postId: "post-1",
      content: "Hello",
    };

    prismaMock.comment.create.mockResolvedValue(baseComment as any);

    const result = await createCommentRepository(data);

    expect(prismaMock.comment.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(baseComment);
  });

  it("edits a comment", async () => {
    prismaMock.comment.update.mockResolvedValue(baseComment as any);

    const result = await editCommentRepository({
      id: "comment-1",
      userId: "user-1",
      content: "Updated",
    });

    expect(prismaMock.comment.update).toHaveBeenCalledWith({
      where: { id: "comment-1" },
      data: { content: "Updated" },
    });
    expect(result).toEqual(baseComment);
  });

  it("finds a comment by id", async () => {
    prismaMock.comment.findUnique.mockResolvedValue(baseComment as any);

    const result = await findCommentByIdRepository("comment-1");

    expect(prismaMock.comment.findUnique).toHaveBeenCalledWith({
      where: { id: "comment-1" },
    });
    expect(result).toEqual(baseComment);
  });

  it("finds comments by post id", async () => {
    prismaMock.comment.findMany.mockResolvedValue([baseComment] as any);

    const result = await findCommentsByPostIdRepository("post-1");

    expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
      where: { postId: "post-1" },
    });
    expect(result).toEqual([baseComment]);
  });
});
