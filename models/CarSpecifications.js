import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { VEHICLE_FUEL_TYPES } from "./const.js";

const CarSpecifications = sequelize.define("CarSpecifications", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  kilowatts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  horsepower: {
    type: DataTypes.VIRTUAL,
    get() {
      const kw = this.getDataValue("kilowatts");
      return kw ? Math.round(kw * 1.341) : null;
    },
  },
  fuel: {
    type: DataTypes.ENUM(...Object.values(VEHICLE_FUEL_TYPES)),
    allowNull: false,
    field: "fuel",
  },
  carModelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "CarModels", key: "id" },
    onDelete: "CASCADE",
  },
});

export default CarSpecifications;
