import { pino } from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: {
        level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
      },
    },
  ],
});

export const logger = pino(
  {
    level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
    enabled: process.env["LOG_ENABLED"] == "true" ? true : false,
  },
  transport,
);
