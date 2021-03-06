import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import jsend from "jsend";
import { logger } from "./helpers";
import config from "./config";
import { errorHandler } from "./middlewares";
import { pricesRouter } from "./api/prices";
import { customRedisRateLimiter } from "./middlewares";

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    type: "application/json",
  })
);
app.use(jsend.middleware);
app.use(customRedisRateLimiter);

app.use("/data", pricesRouter);

app.listen(config.APP.PORT, () => {
  logger.info(`Starting service on  port ${config.APP.PORT}`);
});

app.use(errorHandler);
process.on("unhandledRejection", (reason, promise) => {
  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error(
    `Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`
  );
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.info(" Received SIGINT. Will exit.");
  process.exit();
});
