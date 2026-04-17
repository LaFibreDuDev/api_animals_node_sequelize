import { faker } from "@faker-js/faker";
import { Animal, Category } from "../models";

export async function seedAnimals(count = 10) {
    const categories = await Category.findAll();
    const categoryIds = categories.map((c) => c.get("id") as number);

    const animals = Array.from({ length: count }, () => ({
        name: faker.person.firstName(),
        species: faker.animal.type(),
        age: faker.number.int({ min: 1, max: 20 }),
        categoryId: categoryIds.length > 0
            ? faker.helpers.arrayElement(categoryIds)
            : null,
    }));

    await Animal.bulkCreate(animals);
    console.log(`Seeded ${count} animals.`);
}
