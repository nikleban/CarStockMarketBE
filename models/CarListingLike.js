import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CarListingLike = sequelize.define("CarListingLike", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  carListingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "CarListings", key: "id" },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
    onDelete: "CASCADE",
  },
});

export default CarListingLike;
