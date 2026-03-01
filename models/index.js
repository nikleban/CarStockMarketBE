import sequelize from "../config/db.js";

import Brand from "./Brand.js";
import User from "./User.js";
import CarModel from "./CarModel.js";
import CarSpecifications from "./CarSpecifications.js";
import CarListing from "./CarListing.js";

Brand.hasMany(CarModel, { foreignKey: "brandId" });
CarModel.belongsTo(Brand, { foreignKey: "brandId" });

CarModel.hasMany(CarListing, { foreignKey: "carModelId" });
CarListing.belongsTo(CarModel, { foreignKey: "carModelId" });

CarListing.hasOne(CarSpecifications, { foreignKey: "carListingId", as: "specs" });
CarSpecifications.belongsTo(CarListing, { foreignKey: "carListingId", as: "listing" });

User.hasMany(CarListing, { foreignKey: "userId" });
CarListing.belongsTo(User, { foreignKey: "userId" });

export { sequelize, Brand, User, CarModel, CarSpecifications, CarListing };
