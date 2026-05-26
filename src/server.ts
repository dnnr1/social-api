import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes/router.js";
import errorHandler from "./utils/errorHandler.js";

const app = express();

const corsConfig = {
  origin: "localhost",
};

const port = 8080;

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(route);
app.use(errorHandler);

app.use("/health", (_, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log("app runnion on port: " + port);
});
