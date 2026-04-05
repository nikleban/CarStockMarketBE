import { Op } from "sequelize";

export const buildWhereFiltersCarListings = (filter) => {
    const whereCarListing = {};
    const whereCarSpecifications = {};
    const whereCarModel = {};
    const whereBrand = {};

    if (filter.brand) whereBrand.name = filter.brand;
    if (filter.model) whereCarModel.name = filter.model;
    if (filter.fuelType) whereCarListing.fuel = filter.fuelType;
    if (filter.bodyType) whereCarSpecifications.vehicleShape = filter.bodyType;
    if (filter.fromYear) whereCarListing.registrationYear = { [Op.gte]: filter.fromYear };
    if (filter.mileageUpTo) whereCarListing.mileage = { [Op.lte]: filter.mileageUpTo };
    if (filter.priceUpTo) whereCarListing.price = { [Op.lte]: filter.priceUpTo };
    return { whereCarListing, whereCarModel, whereBrand, whereCarSpecifications };
}