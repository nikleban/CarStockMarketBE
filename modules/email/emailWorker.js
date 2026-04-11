import { Worker } from "bullmq";
import EmailService from "#/modules/email/emailService.js";
import { LoginEmailContext } from "#/modules/email/emailContext.js";
import { loginTemplate } from "#/modules/email/templates/login.template.js";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
};

const emailService = new EmailService();

// Each entry defines how to build and send one email type.
// To add a new email: create its template + context, then add an entry here.
const emailHandlers = {
  login: {
    subject: "Successful login",
    template: loginTemplate,
    buildContext: (data) => new LoginEmailContext({ userName: data.userName, loginPageLink: "nekipeki" }),
  },
};

const emailWorker = new Worker(
  "email",
  async (job) => {
    const { type, to, ...data } = job.data;

    const handler = emailHandlers[type];
    if (!handler) {
      throw new Error(`No email handler registered for type: "${type}"`);
    }

    const context = handler.buildContext(data);
    await emailService.sendEmail({ to, subject: handler.subject, template: handler.template, context });
  },
  { connection: redisConnection }
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Email job ${job.id} failed:`, error.message);
});

export default emailWorker;
