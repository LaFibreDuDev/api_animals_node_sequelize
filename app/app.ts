import express from "express";
import swaggerUi from "swagger-ui-express";
import mainRouter from "./routers/main_router";
import animalRouter from "./routers/animal_router";
import { swaggerSpec } from "./config/swagger";

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/animals", animalRouter);
app.use("/", mainRouter);

export default app;
