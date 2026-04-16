import debug from "debug";
import express from "express";
import swaggerUi from "swagger-ui-express";
import mainRouter from "./routers/main_router";
import animalRouter from "./routers/animal_router";
import { sequelize } from "./models";
import { swaggerSpec } from "./config/swagger";

const log = debug("app:main");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/animals", animalRouter);
app.use("/", mainRouter);


async function start() {
  await sequelize.authenticate();
  log("Database connection established.");

  await sequelize.sync();
  log("Database synchronized.");

  app.listen(process.env.PORT ?? 3000, () => {
    log("Server is running on port %s", process.env.PORT ?? 3000);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});