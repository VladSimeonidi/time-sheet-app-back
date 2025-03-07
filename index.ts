import * as dotenv from "dotenv";
import express, { Express } from "express";
import { logger } from "./logger";
// import limiter from "express-rate-limit";
import cors from "cors";
import useRoutes from "./routes";
import { connectDB } from "./db";

const corsOptions = {
  origin: "http://localhost:4200",
};

dotenv.config();

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
useRoutes(app);

connectDB(process.env.CONNECTION_URI);

const port = 3000;

app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});
