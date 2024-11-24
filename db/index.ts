import mongoose from "mongoose";
import { logger } from "../logger";

function connectDB(connectionURI: string | undefined): void {

    if (!connectionURI) {
        console.log("DB Connection URI is falsy!")
        return undefined
    };

    mongoose
        .connect(connectionURI)
        .then(() => logger.info("Connected to MongoDB"))
        .catch((e) => {
            logger.error("NOT connected to MongoDB...");
        });
}

export { connectDB };