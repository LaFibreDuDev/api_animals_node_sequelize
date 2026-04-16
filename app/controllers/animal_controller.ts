import { Request, Response } from "express";
import { Animal } from "../models";

const animalController = {
    index: async (_req: Request, res: Response) => {
        try {
            const animals = await Animal.findAll();
            res.status(200).json(animals);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default animalController;
