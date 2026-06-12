import express from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import route from "./routes.js";
import errorHandler from "./utils/errorHandler.js";
import helmet from "helmet";
import { config, validateConfig } from "./config/index.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { connectRedis } from "./utils/redis.js";
import { prisma } from "./db.js";
import { logger } from "./utils/logger.js";

validateConfig();

const app = express();
const baseAPI = "/api/v1";

const corsConfig: CorsOptions = {
  origin: config.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter());
app.use(requestLogger);
app.use(baseAPI, route);
app.use(errorHandler);

app.get("/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
});

async function start(): Promise<void> {
  await connectRedis();

  app.listen(config.port, () => {
    logger.info("Server started", { port: config.port, environment: config.nodeEnv });
  });
}

start();
