import { Router } from "express";
import animalController from "../controllers/animal_controller";

const animalRouter = Router();

animalRouter.get("/", animalController.index);

export default animalRouter;
