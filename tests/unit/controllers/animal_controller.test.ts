jest.mock("../../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
    },
}));

import { Animal } from "../../../app/models";
import { AnimalController } from "../../../app/controllers/animal_controller";
import { ApiError } from "../../../app/errors";

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

    describe("update", () => {
        const body = { name: "Rex Updated", species: "dog", age: 4 };

        it("returns the updated animal", async () => {
            const mockAnimal = { id: 1, ...body, update: jest.fn().mockResolvedValue(undefined) };
            (Animal.findByPk as jest.Mock).mockResolvedValue(mockAnimal);

            const result = await new AnimalController().update(1, body);

            expect(Animal.findByPk).toHaveBeenCalledWith(1);
            expect(mockAnimal.update).toHaveBeenCalledWith(body);
            expect(result).toEqual(mockAnimal);
        });

        it("throws ApiError 404 when animal is not found", async () => {
            (Animal.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(new AnimalController().update(99, body)).rejects.toThrow(ApiError);
            await expect(new AnimalController().update(99, body)).rejects.toMatchObject({ status: 404 });
        });

        it("throws when findByPk throws", async () => {
            (Animal.findByPk as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(new AnimalController().update(1, body)).rejects.toThrow("DB error");
        });
    });
});
