import request from "supertest";

const mockAnimal = {
    update: jest.fn(),
    destroy: jest.fn(),
};

jest.mock("../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
    },
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn(),
    },
}));

import app from "../../app/app";
import { Animal } from "../../app/models";

describe("GET /animals", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns 200 with an array of animals", async () => {
        const animals = [
            { id: 1, name: "Rex", species: "dog", age: 3 },
            { id: 2, name: "Mia", species: "cat", age: 5 },
        ];
        (Animal.findAll as jest.Mock).mockResolvedValue(animals);

        const res = await request(app).get("/animals");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(animals);
    });

    it("returns 500 when the database fails", async () => {
        (Animal.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/animals");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });
    });
});

describe("POST /animals", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns 201 with the created animal", async () => {
        const body = { name: "Rex", species: "dog", age: 3 };
        const created = { id: 1, ...body };
        (Animal.create as jest.Mock).mockResolvedValue(created);

        const res = await request(app).post("/animals").send(body);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(created);
    });

    it("returns 201 with categoryId when provided", async () => {
        const body = { name: "Rex", species: "dog", age: 3, categoryId: 2 };
        (Animal.create as jest.Mock).mockResolvedValue({ id: 1, ...body });

        const res = await request(app).post("/animals").send(body);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ categoryId: 2 });
    });

    it("returns 422 when a required field is missing", async () => {
        const res = await request(app).post("/animals").send({ name: "Rex" });

        expect(res.status).toBe(422);
    });

    it("returns 500 when the database fails", async () => {
        (Animal.create as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).post("/animals").send({ name: "Rex", species: "dog", age: 3 });

        expect(res.status).toBe(500);
    });
});

describe("PUT /animals/:id", () => {
    const body = { name: "Rex Updated", species: "dog", age: 4 };

    beforeEach(() => {
        jest.clearAllMocks();
        mockAnimal.update.mockResolvedValue(undefined);
    });

    it("returns 200 with the updated animal", async () => {
        const existing = { id: 1, name: "Rex", species: "dog", age: 3, ...mockAnimal };
        (Animal.findByPk as jest.Mock).mockResolvedValue(existing);

        const res = await request(app).put("/animals/1").send(body);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 1 });
    });

    it("returns 404 when the animal does not exist", async () => {
        (Animal.findByPk as jest.Mock).mockResolvedValue(null);

        const res = await request(app).put("/animals/99").send(body);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Animal not found" });
    });

    it("returns 422 when a required field is missing", async () => {
        const res = await request(app).put("/animals/1").send({ name: "Rex" });

        expect(res.status).toBe(422);
    });

    it("returns 500 when the database fails", async () => {
        (Animal.findByPk as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).put("/animals/1").send(body);

        expect(res.status).toBe(500);
    });
});

describe("DELETE /animals/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAnimal.destroy.mockResolvedValue(undefined);
    });

    it("returns 204 on success", async () => {
        (Animal.findByPk as jest.Mock).mockResolvedValue({ id: 1, ...mockAnimal });

        const res = await request(app).delete("/animals/1");

        expect(res.status).toBe(204);
    });

    it("returns 404 when the animal does not exist", async () => {
        (Animal.findByPk as jest.Mock).mockResolvedValue(null);

        const res = await request(app).delete("/animals/99");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Animal not found" });
    });

    it("returns 500 when the database fails", async () => {
        (Animal.findByPk as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).delete("/animals/1");

        expect(res.status).toBe(500);
    });
});
