import rateLimit from "express-rate-limit";
import { Application } from "express";

type HttpMethod = "get" | "post" | "put" | "delete";
type rateLimitType = {
  endpoint: string;
  method: HttpMethod;
  rateLimit: number;
  ms: number;
};

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const rateLimits: rateLimitType[] = [
  { endpoint: "/user/login", method: "post", rateLimit: 10, ms: ONE_HOUR },
  { endpoint: "/user", method: "post", rateLimit: 5, ms: 30 * ONE_MINUTE },
  { endpoint: "/post", method: "get", rateLimit: 10, ms: ONE_SECOND },
  { endpoint: "/post", method: "post", rateLimit: 60, ms: ONE_HOUR },
  { endpoint: "/follow", method: "get", rateLimit: 50, ms: ONE_MINUTE },
  { endpoint: "/follow", method: "post", rateLimit: 10, ms: ONE_MINUTE },
  { endpoint: "/message", method: "post", rateLimit: 50, ms: ONE_MINUTE },
  { endpoint: "/message", method: "get", rateLimit: 100, ms: ONE_MINUTE },
  { endpoint: "/search", method: "get", rateLimit: 50, ms: 10 * ONE_MINUTE },
];

export function applyRateLimits(app: Application) {
  rateLimits.forEach((limit) => {
    const limiter = rateLimit({
      windowMs: limit.ms,
      max: limit.rateLimit,
      message: `Too many requests from this IP, please try again after a minute`,
    });

    app[limit.method](limit.endpoint, limiter);
  });
}
