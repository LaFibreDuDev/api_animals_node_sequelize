jest.mock("../../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));

import { Animal } from "../../../app/models";
import { AnimalController } from "../../../app/controllers/animal_controller";

describe("AnimalController", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("getAll", () => {
        it("returns the list of animals", async () => {
            const animals = [{ id: 1, name: "Rex", species: "dog", age: 3 }];
            (Animal.findAll as jest.Mock).mockResolvedValue(animals);

            const result = await new AnimalController().getAll();

            expect(result).toEqual(animals);
        });

        it("throws when findAll throws", async () => {
            (Animal.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(new AnimalController().getAll()).rejects.toThrow("DB error");
        });
    });

    describe("create", () => {
        it("returns the created animal", async () => {
            const body = { name: "Rex", species: "dog", age: 3 };
            const created = { id: 1, ...body };
            (Animal.create as jest.Mock).mockResolvedValue(created);

            const result = await new AnimalController().create(body);

            expect(Animal.create).toHaveBeenCalledWith(body);
            expect(result).toEqual(created);
        });

        it("throws when create throws", async () => {
            (Animal.create as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(new AnimalController().create({ name: "Rex", species: "dog", age: 3 })).rejects.toThrow("DB error");
        });
    });
});
