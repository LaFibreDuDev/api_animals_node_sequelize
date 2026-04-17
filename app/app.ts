import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import mainRouter from "./routers/main_router";
import { RegisterRoutes } from "./routers/routes";

const swaggerDocument = require("./config/swagger.json");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);
app.use("/", mainRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidateError) {
        res.status(422).json({ message: "Validation failed", details: err.fields });
        return;
    }
    res.status(500).json({ message: "Internal server error" });
});

export default app;
