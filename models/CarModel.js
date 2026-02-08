import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CarModel = sequelize.define("CarModel", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Brands", key: "id" },
    onDelete: "CASCADE",
  },
});

export default CarModel;
