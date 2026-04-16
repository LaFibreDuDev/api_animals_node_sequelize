import debug from "debug";
import express from "express";
import mainRouter from "./routers/main_router";

const log = debug("app:main");

const app = express();
app.use(express.json());

app.use(mainRouter);

app.listen(3000, () => {
  log("Authentication service is running on port 3000");
});