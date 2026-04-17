import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";

export class Category extends Model {}

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: "Category",
});
