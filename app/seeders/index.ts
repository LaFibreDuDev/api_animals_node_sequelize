import { sequelize } from "../models";
import { seedCategories } from "./category.seeder";
import { seedAnimals } from "./animal.seeder";
import { seedUsers } from "./user.seeder";

async function runSeeders() {
    await sequelize.authenticate();

    await seedCategories();
    await seedAnimals();
    await seedUsers();

    console.log("Seeding complete.");
    process.exit(0);
}

runSeeders().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
