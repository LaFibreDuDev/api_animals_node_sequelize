import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default async function globalSetup() {
    const { sequelize } = await import("../../../app/models");
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
}
