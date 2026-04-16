import { sequelize } from "../models";
import { seedAnimals } from "./animal.seeder";
import { seedUsers } from "./user.seeder";

async function runSeeders() {
    await sequelize.authenticate();

    await seedAnimals();
    await seedUsers();

    console.log("Seeding complete.");
    process.exit(0);
}

runSeeders().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
