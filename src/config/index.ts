import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "8080", 10),
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || ["http://localhost:3000"],
  databaseUrl: process.env.DATABASE_URL,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
} as const;

export function validateConfig(): void {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }
}