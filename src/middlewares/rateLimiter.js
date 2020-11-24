import moment from "moment";
import redis from "redis";
import fs from "fs";

const redisClient = redis.createClient({
  host: "redis-server",
  port: 6379,
});
const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

export const customRedisRateLimiter = (req, res, next) => {
  try {
    // check that redis client exists
    if (!redisClient) {
      throw new Error("Redis client does not exist!");
      process.exit(1);
    }

    const ip = req.connection.remoteAddress;

    redisClient.get(ip, function(err, record) {
      if (err) throw err;
      const currentRequestTime = moment();

      if (!record) {
        let newRecord = [];
        let requestLog = {
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        };
        newRecord.push(requestLog);
        redisClient.set(ip, JSON.stringify(newRecord));
        return next();
      }

      let data = JSON.parse(record);

      let windowStartTimestamp = moment()
        .subtract(WINDOW_SIZE_IN_HOURS, "hours")
        .unix();

      let requestsWithinWindow = data.filter((entry) => {
        return entry.requestTimeStamp > windowStartTimestamp;
      });

      console.log("requestsWithinWindow", requestsWithinWindow);

      let totalWindowRequestsCount = requestsWithinWindow.reduce(
        (accumulator, entry) => {
          return accumulator + entry.requestCount;
        },
        0
      );

      if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        const stream = fs.createWriteStream("ip.txt", { flags: "a" });
        stream.write(`${ip}\n`);
        stream.end();

        res
          .status(429)
          .jsend.error(
            `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
          );
      } else {
        let lastRequestLog = data[data.length - 1];
        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
          .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
          .unix();

        if (
          lastRequestLog.requestTimeStamp >
          potentialCurrentWindowIntervalStartTimeStamp
        ) {
          lastRequestLog.requestCount++;
          data[data.length - 1] = lastRequestLog;
        } else {
          //  if interval has passed, log new entry for current user and timestamp
          data.push({
            requestTimeStamp: currentRequestTime.unix(),
            requestCount: 1,
          });
        }
        redisClient.set(ip, JSON.stringify(data));
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
