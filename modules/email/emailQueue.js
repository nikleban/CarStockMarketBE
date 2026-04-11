import { Queue } from "bullmq";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
};

const emailQueue = new Queue("email", { connection: redisConnection });

export default emailQueue;
