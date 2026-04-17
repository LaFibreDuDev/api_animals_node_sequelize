import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
});

export { User } from "./user";
export { Animal } from "./animal";
export { Category } from "./category";

import { Animal } from "./animal";
import { Category } from "./category";

Category.hasMany(Animal, { foreignKey: "categoryId", as: "animals" });
Animal.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
