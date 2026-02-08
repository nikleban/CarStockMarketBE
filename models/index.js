import sequelize from "../config/db.js";

import Brand from "./Brand.js";
import User from "./User.js";
import CarModel from "./CarModel.js";
import CarSpecifications from "./CarSpecifications.js";
import CarListing from "./CarListing.js";

Brand.hasMany(CarModel, { foreignKey: "brandId" });
CarModel.belongsTo(Brand, { foreignKey: "brandId" });

CarModel.hasMany(CarSpecifications, { foreignKey: "carModelId" });
CarSpecifications.belongsTo(CarModel, { foreignKey: "carModelId" });

CarSpecifications.hasMany(CarListing, { foreignKey: "carSpecificationsId" });
CarListing.belongsTo(CarSpecifications, { foreignKey: "carSpecificationsId" });

User.hasMany(CarListing, { foreignKey: "userId" });
CarListing.belongsTo(User, { foreignKey: "userId" });

export { sequelize, Brand, User, CarModel, CarSpecifications, CarListing };
