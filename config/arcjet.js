import arcjet,{shield,detectBot,tokenBucket} from "@arcjet/node";
import { ARCJET_API_KEY } from "./env.js";

const aj = arcjet({
    key: ARCJET_API_KEY,
    characteristics: ["ip.src"],
    rules: [
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "127.0.0.1", // Allow local requests
          "::1" // IPv6 localhost
        ],
      }),
      tokenBucket({
        mode: "LIVE",
        refillRate: 5, // Refill 5 tokens per interval
        interval: 10, // Refill every 10 seconds
        capacity: 10, // Bucket capacity of 10 tokens
        requested: 1,
      }),
    ],
  });

export default aj;