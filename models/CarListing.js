import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { VEHICLE_SHAPE_CHOICES } from "./const.js";

const CarListing = sequelize.define("CarListing", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicleShape: {
    type: DataTypes.ENUM(...Object.values(VEHICLE_SHAPE_CHOICES)),
    allowNull: false,
    field: "vehicleShape",
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 100,
      max: 5_000_000,
    },
  },
  carSpecificationsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "CarSpecifications", key: "id" },
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
