import request from "supertest";

jest.mock("../../app/models", () => ({
    Animal: {
        findAll: jest.fn(),
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
