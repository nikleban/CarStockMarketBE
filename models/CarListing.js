import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { VEHICLE_FUEL_TYPES } from "./const.js";

const CarListing = sequelize.define("CarListing", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 100,
      max: 5_000_000,
    },
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
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    max: 2_000_000,
  },
  registrationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1886,
      max: new Date().getFullYear() + 1,
    },
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  registrationMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12,
    },
  },
  carModelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "CarModels", key: "id" },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
    onDelete: "CASCADE",
  },
});

export default CarListing;
