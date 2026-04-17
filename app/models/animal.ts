import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";

export class Animal extends Model {}

Animal.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    species: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Categories", key: "id" },
    },
}, {
    sequelize,
    modelName: "Animal",
});
