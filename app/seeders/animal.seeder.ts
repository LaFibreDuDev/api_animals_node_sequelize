import { faker } from "@faker-js/faker";
import { Animal } from "../models";

export async function seedAnimals(count = 10) {
    const animals = Array.from({ length: count }, () => ({
        name: faker.person.firstName(),
        species: faker.animal.type(),
        age: faker.number.int({ min: 1, max: 20 }),
    }));

    await Animal.bulkCreate(animals);
    console.log(`Seeded ${count} animals.`);
}
