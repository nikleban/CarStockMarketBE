import sequelize from "#/config/db.js";

import Brand from "#/models/Brand.js";
import User from "#/models/User.js";
import CarModel from "#/models/CarModel.js";
import CarSpecifications from "#/models/CarSpecifications.js";
import CarListing from "#/models/CarListing.js";
import CarListingLike from "#/models/CarListingLike.js";

Brand.hasMany(CarModel, { foreignKey: "brandId" });
CarModel.belongsTo(Brand, { foreignKey: "brandId" });

CarModel.hasMany(CarListing, { foreignKey: "carModelId" });
CarListing.belongsTo(CarModel, { foreignKey: "carModelId" });

CarListing.hasOne(CarSpecifications, { foreignKey: "carListingId", as: "specs" });
CarSpecifications.belongsTo(CarListing, { foreignKey: "carListingId", as: "listing" });

User.hasMany(CarListing, { foreignKey: "userId" });
CarListing.belongsTo(User, { foreignKey: "userId" });


CarListingLike.belongsTo(User, { foreignKey: "userId" })
CarListingLike.belongsTo(CarListing, { foreignKey: "carListingId" })

User.hasMany(CarListingLike, { foreignKey: "userId" });
CarListing.hasMany(CarListingLike, { foreignKey: "carListingId", as: "liked" });

export { sequelize, Brand, User, CarModel, CarSpecifications, CarListing };
