import { Request, Response } from "express";

jest.mock("../../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
    },
}));

import { Animal } from "../../../app/models";
import animalController from "../../../app/controllers/animal_controller";

const mockReq = {} as Request;
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as unknown as Response;

describe("animalController.index", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns 200 with the list of animals", async () => {
        const animals = [{ id: 1, name: "Rex", species: "dog", age: 3 }];
        (Animal.findAll as jest.Mock).mockResolvedValue(animals);

        await animalController.index(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(animals);
    });

    it("returns 500 when findAll throws", async () => {
        (Animal.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

        await animalController.index(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});
