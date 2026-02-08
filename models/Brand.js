import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Brand = sequelize.define("Brand", {
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
});

export default Brand;
