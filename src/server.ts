import express from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import route from "./routes.js";
import errorHandler from "./utils/errorHandler.js";
import helmet from "helmet";

const app = express();
const baseAPI = "/api/v1";

const corsConfig: CorsOptions = {
  origin: "localhost",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(baseAPI, route);
app.use(errorHandler);

app.use("/health", (_, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log("app running on port: " + port);
});
