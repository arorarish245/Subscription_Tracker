import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await Promise.race([
            aj.protect(req, { requested: 1 }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Arcjet request timeout")), 5000))
        ]);

        if (!decision) {
            console.warn("Arcjet returned no decision, skipping protection.");
            return next();
        }

        console.log("Arcjet Decision:", decision);

        if (decision.isDenied()) {
            console.log("Denied Reason:", decision.reason);
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Rate limit exceeded" });
            }
            if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot detected" });
            }
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    } catch (error) {
        console.error(`Arcjet Middleware error: ${error.message}`);
        return res.status(500).json({ error: "Arcjet service timeout" });
    }
};

export default arcjetMiddleware;
