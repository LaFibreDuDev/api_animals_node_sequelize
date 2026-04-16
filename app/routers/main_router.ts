import { Router } from "express";
import mainController from "../controllers/main_controller";

const mainRouter = Router();

mainRouter.use("/", mainController.index);

export default mainRouter;