import CarModel from "#/models/CarModel.js";
import CarListing from "#/models/CarListing.js";
import User from "#/models/User.js";
import CarSpecifications from "#/models/CarSpecifications.js";
import AppError from "#/errors/AppErrors.js";
import Brand from "#/models/Brand.js";
import sequelize from "#/config/db.js";
import CarListingLike from "#/models/CarListingLike.js";

export const createCarListing = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const data = req.body;
        const photos = req.files;
        const carModel = await CarModel.findOne({ where: { name: data.brandModel } });

        if (!carModel) {
            throw new AppError("Car model not found", 404);
        }

        const carAlreadyExists = await CarSpecifications.findOne({where: { vinNumber: data.vinNumber }})

        if(carAlreadyExists) {
            throw new AppError("Car Already exists", 400);
        }

        const carListing = await CarListing.create({
            price: data.price,
            kilowatts: data.kilowatts,
            photos: photos,
            fuel: data.fuelType,
            mileage: data.mileage,
            registrationYear: data.registrationYear,
            registrationMonth: data.registrationMonth,
            description: data.description,
            userId: data.userId,
            carModelId: carModel.id,
            },
            { transaction }
        );
        
        await CarSpecifications.create({
            vehicleShape: data.vehicleShape,
            color: data.color,
            numOfDoors: data.numOfDoors,
            numOfSeats: data.numOfSeats,
            fuelConsumption: data.fuelConsumption,
            motorVolumeFrom: data.motorVolumeFrom,
            motorVolumeTo: data.motorVolumeTo,
            vinNumber: data.vinNumber,
            numOfOwners: data.numberOfOwners,
            technicalValidity: data.technicalValidityDate,
            carListingId: carListing.id,
            },
            { transaction }
        );
        await transaction.commit();

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
        const page = req.query.page;
        const limit = 10
        const offset = (page - 1) * limit;
        
        const userId = req.user.id;

        const carListings = await CarListing.findAll({
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [{
                model: CarModel,
                attributes: ["name"],
                include: [{
                    model: Brand,
                    attributes: ["name"]
                }],
            },
            {
                model: CarListingLike,
                as: "liked",
                where: { userId: userId },
                required: false
            }]
        });

        const formatted = carListings.map((listing) => {
            const json = listing.toJSON();

            return {
                ...json,
                liked: json.liked?.length > 0
            };
        });

        return res.status(200).json(formatted);
    } catch (error) {
        return next(error);
    }
};

export const getCarListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const carListing = await CarListing.findByPk(id);

        if (!carListing){
            throw new AppError("Car Listing doesnt exist");
        }
        const carSpecifications = await CarSpecifications.findOne({ where: {
            carListingId: id
        }});

        if (!carSpecifications) {
            throw new AppError("Car specifications dont exist");
        }
        
        const isLiked = await CarListingLike.count({where: { userId: userId, carListingId: carListing.id }});
        console.log(isLiked);
        const carData = {
            ...carListing.get(),
            specifications: {
                vehicleShape: carSpecifications.get().vehicleShape,
                color: carSpecifications.get().color,
                numOfDoors: carSpecifications.get().numOfDoors,
                numOfSeats: carSpecifications.get().numOfSeats,
                fuelConsumption: carSpecifications.get().fuelConsumption,
                motorVolumeFrom: carSpecifications.get().motorVolumeFrom,
                motorVolumeTo: carSpecifications.get().motorVolumeTo,
                vinNumber: carSpecifications.get().vinNumber,
                numOfOwners: carSpecifications.get().numOfOwners,
                techincalValidity: carSpecifications.get().technicalValidity,
            },
            liked: isLiked > 0,
        };
        return res.status(200).json(carData);
    } catch (error) {
        return next(error);
    }
};

export const getSellerData = async (req, res, next) => {
    try {
        const { id } = req.params;

        const carListing = await CarListing.findByPk(id);
        const userId = carListing.userId;
        const user = await User.findByPk(userId);
        
        const userListingsCount = await CarListing.count({
            where: {
                userId: userId
            }
        });
        
        const accountAge = user.createdAt.getFullYear();

        const sellerData = {
            firstName: user.firstName,
            lastName: user.lastName,
            accountAge: accountAge,
            numOfListings: userListingsCount,
        }

        return res.status(200).json(sellerData);
    } catch (error) {
        return next(error);
    }
};