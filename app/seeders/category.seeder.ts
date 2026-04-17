import { Category } from "../models";

const CATEGORIES = ["Mammal", "Bird", "Reptile", "Fish", "Amphibian", "Insect"];

export async function seedCategories() {
    await Category.bulkCreate(
        CATEGORIES.map((name) => ({ name })),
        { ignoreDuplicates: true }
    );
    console.log(`Seeded ${CATEGORIES.length} categories.`);
}
