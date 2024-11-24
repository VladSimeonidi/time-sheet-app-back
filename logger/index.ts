import winston, {Logger} from "winston";

const logger: Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "DD-MM-YYYY HH:mm:ss",
        }),
        winston.format.simple()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export { logger };
