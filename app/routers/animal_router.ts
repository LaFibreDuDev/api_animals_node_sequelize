import { Router } from "express";
import animalController from "../controllers/animal_controller";

const animalRouter = Router();

/**
 * @openapi
 * /animals:
 *   get:
 *     summary: Get all animals
 *     tags:
 *       - Animals
 *     responses:
 *       200:
 *         description: List of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   species:
 *                     type: string
 *                   age:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */
animalRouter.get("/", animalController.index);

export default animalRouter;
