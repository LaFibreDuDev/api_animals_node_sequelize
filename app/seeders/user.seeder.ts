import { faker } from "@faker-js/faker";
import { User } from "../models";

export async function seedUsers(count = 10) {
    const users = Array.from({ length: count }, () => ({
        username: faker.internet.username(),
        password: faker.internet.password(),
    }));

    await User.bulkCreate(users);
    console.log(`Seeded ${count} users.`);
}
