import debug from "debug";
import app from "./app";
import { sequelize } from "./models";

const log = debug("app:main");

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
