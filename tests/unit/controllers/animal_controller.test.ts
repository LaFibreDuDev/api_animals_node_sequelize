jest.mock("../../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
    },
}));

import { Animal } from "../../../app/models";
import { AnimalController } from "../../../app/controllers/animal_controller";

describe("AnimalController.getAll", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns the list of animals", async () => {
        const animals = [{ id: 1, name: "Rex", species: "dog", age: 3 }];
        (Animal.findAll as jest.Mock).mockResolvedValue(animals);

        const controller = new AnimalController();
        const result = await controller.getAll();

        expect(result).toEqual(animals);
    });

    it("throws when findAll throws", async () => {
        (Animal.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

        const controller = new AnimalController();
        await expect(controller.getAll()).rejects.toThrow("DB error");
    });
});
