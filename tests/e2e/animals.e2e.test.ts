import request from "supertest";
import app from "../../app/app";
import { Animal, sequelize } from "../../app/models";

const SEED_DATA = [
    { name: "Rex", species: "dog", age: 3 },
    { name: "Mia", species: "cat", age: 5 },
    { name: "Nemo", species: "fish", age: 1 },
    { name: "Bella", species: "rabbit", age: 4 },
    { name: "Max", species: "dog", age: 7 },
];

async function seedAnimals(count = SEED_DATA.length) {
    await Animal.bulkCreate(SEED_DATA.slice(0, count));
}

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Animal.destroy({ truncate: true });
});

describe("POST /animals", () => {
    it("returns 201 with the created animal", async () => {
        const body = { name: "Rex", species: "dog", age: 3 };

        const res = await request(app).post("/animals").send(body);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: expect.any(Number), ...body });
    });

    it("persists the animal in the database", async () => {
        await request(app).post("/animals").send({ name: "Rex", species: "dog", age: 3 });

        const animals = await Animal.findAll();
        expect(animals).toHaveLength(1);
        expect(animals[0].get("name")).toBe("Rex");
    });

    it("returns 422 when a required field is missing", async () => {
        const res = await request(app).post("/animals").send({ name: "Rex" });

        expect(res.status).toBe(422);
    });
});

describe("PUT /animals/:id", () => {
    it("returns 200 with the updated animal", async () => {
        const [animal] = await Animal.bulkCreate([{ name: "Rex", species: "dog", age: 3 }]);
        const body = { name: "Rex Updated", species: "dog", age: 4 };

        const res = await request(app).put(`/animals/${animal.get("id")}`).send(body);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: animal.get("id"), ...body });
    });

    it("persists the changes in the database", async () => {
        const [animal] = await Animal.bulkCreate([{ name: "Rex", species: "dog", age: 3 }]);
        const id = animal.get("id") as number;

        await request(app).put(`/animals/${id}`).send({ name: "Rex Updated", species: "dog", age: 4 });

        const updated = await Animal.findByPk(id);
        expect(updated?.get("name")).toBe("Rex Updated");
        expect(updated?.get("age")).toBe(4);
    });

    it("returns 404 when the animal does not exist", async () => {
        const res = await request(app).put("/animals/99999").send({ name: "Rex", species: "dog", age: 3 });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Animal not found" });
    });

    it("returns 422 when a required field is missing", async () => {
        const [animal] = await Animal.bulkCreate([{ name: "Rex", species: "dog", age: 3 }]);

        const res = await request(app).put(`/animals/${animal.get("id")}`).send({ name: "Rex" });

        expect(res.status).toBe(422);
    });
});

describe("GET /animals", () => {
    it("returns 200 with an empty array when no animals exist", async () => {
        const res = await request(app).get("/animals");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns 200 with the correct count after seeding", async () => {
        await seedAnimals(5);

        const res = await request(app).get("/animals");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(5);
    });

    it("returns animals with the expected shape", async () => {
        await seedAnimals(1);

        const res = await request(app).get("/animals");

        expect(res.status).toBe(200);
        expect(res.body[0]).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            species: expect.any(String),
            age: expect.any(Number),
        });
    });

    it("returns 200 with the exact animals inserted", async () => {
        await seedAnimals(2);

        const res = await request(app).get("/animals");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "Rex", species: "dog", age: 3 }),
                expect.objectContaining({ name: "Mia", species: "cat", age: 5 }),
            ])
        );
    });
});
