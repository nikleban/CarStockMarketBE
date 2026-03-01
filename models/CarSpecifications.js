import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { VEHICLE_SHAPE_CHOICES } from "./const.js";


const CarSpecifications = sequelize.define("CarSpecifications", {
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
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numOfDoors: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 9,
    },
  },
  numOfSeats: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10,
    },
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  fuelConsumption: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motorVolumeFrom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motorVolumeTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vinNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  numOfOwners: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 20,
    },
  },
  techincalValidity: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  carListingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: "CarListings", key: "id" },
    onDelete: "CASCADE",
  },
});

export default CarSpecifications;
