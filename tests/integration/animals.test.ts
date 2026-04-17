import request from "supertest";

jest.mock("../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
        create: jest.fn(),
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
