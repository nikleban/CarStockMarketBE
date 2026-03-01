import CarModel from "../../models/CarModel.js";
import CarListing from "../../models/CarListing.js";
import CarSpecifications from "../../models/CarSpecifications.js";
import AppError from "../../errors/AppErrors.js";

export const createCarListing = async (req, res, next) => {
    try {
        const data = req.body.data;
        const carModel = await CarModel.findOne({ where: { name: data.brandModel } });

        if (!carModel) {
            throw new AppError("Car model not found", 404);
        }
        const carListing = await CarListing.create({
            price: data.price,
            kilowatts: data.kilowatts,
            fuel: data.fuelType,
            mileage: data.mileage,
            registrationYear: data.registrationYear,
            registrationMonth: data.registrationMonth,
            userId: data.userId,
            carModelId: carModel.id,
        });
        
        await CarSpecifications.create({
            vehicleShape: data.vehicleShape,
            color: data.color,
            numOfDoors: data.numOfDoors,
            numOfSeats: data.numOfSeats,
            photos: data.photos,
            fuelConsumption: data.fuelConsumption,
            motorVolumeFrom: data.motorVolumeFrom,
            motorVolumeTo: data.motorVolumeTo,
            vinNumber: data.vinNumber,
            numOfOwners: data.numberOfOwners,
            techincalValidity: data.techincalValidity,
            carListingId: carListing.id,
        });

        return res.status(201).json({
            ok: true,
            received: req.body,
        });
    } catch (error) {
        return next(error);
    }
};

export const getCarListings = async (req, res, next) => {
    try {
        const carListings = await CarListing.findAll({});
        return res.status(200).json(carListings);
    } catch (error) {
        return next(error);
    }
};