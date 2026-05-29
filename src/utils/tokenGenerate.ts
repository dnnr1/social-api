import jwt from "jsonwebtoken";

function tokenGenerate(data: unknown): string {
  return jwt.sign({ data }, process.env.JWT_SECRET as string);
}

export default tokenGenerate;
