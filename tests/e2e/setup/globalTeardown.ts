import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default async function globalTeardown() {
    const { sequelize } = await import("../../../app/models");
    await sequelize.drop();
    await sequelize.close();
}
