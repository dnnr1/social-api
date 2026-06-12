import express from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import route from "./routes.js";
import errorHandler from "./utils/errorHandler.js";
import helmet from "helmet";
import { config, validateConfig } from "./config/index.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { connectRedis } from "./utils/redis.js";

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
app.use(baseAPI, route);
app.use(errorHandler);

app.get("/health", async (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

async function start(): Promise<void> {
  await connectRedis();

  app.listen(config.port, () => {
    console.log(`app running on port: ${config.port}`);
  });
}

start();
