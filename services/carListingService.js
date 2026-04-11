import CarListing from '#/models/CarListing.js';
import CarListingLike from '#/models/CarListingLike.js';
import CarModel from '#/models/CarModel.js';
import Brand from '#/models/Brand.js';
import User from '#/models/User.js';
import CarSpecifications from '#/models/CarSpecifications.js';
import sequelize from '#/config/db.js';
import AppError from '#/errors/AppErrors.js';

import { buildWhereFiltersCarListings } from '#/utils/carListingUtils.js';

export const getCarListingsService = async ({ query, user }) => {
  try {
    const page = Number(query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const userId = user.id;

    const { whereCarListing, whereCarSpecifications, whereBrand, whereCarModel } =
      buildWhereFiltersCarListings(query);

    const hasBrandFilter = Object.keys(whereBrand).length > 0;
    const hasModelFilter = Object.keys(whereCarModel).length > 0;

    const carListings = await CarListing.findAll({
      limit,
      offset,
      subQuery: false,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: CarModel,
          attributes: ['name'],
          where: hasModelFilter ? whereCarModel : undefined,
          required: hasBrandFilter || hasModelFilter,
          include: [
            {
              model: Brand,
              attributes: ['name'],
              where: hasBrandFilter ? whereBrand : undefined,
              required: hasBrandFilter,
            },
          ],
        },
        {
          model: CarListingLike,
          as: 'liked',
          where: { userId: userId },
          required: false,
        },
      ],
      where: whereCarListing,
    });

    const formatted = carListings.map((listing) => {
      const json = listing.toJSON();

      return {
        ...json,
        liked: json.liked?.length > 0,
      };
    });
    return formatted;
  } catch (error) {
    throw error;
  }
};

export const createCarListingService = async ({ data, photos }) => {
  const transaction = await sequelize.transaction();
  try {
    const carModel = await CarModel.findOne({ where: { name: data.brandModel } });

    if (!carModel) {
      throw new AppError('Car model not found', 404);
    }

    const carAlreadyExists = await CarSpecifications.findOne({
      where: { vinNumber: data.vinNumber },
    });

    if (carAlreadyExists) {
      throw new AppError('Car Already exists', 400);
    }

    const carListing = await CarListing.create(
      {
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

    await CarSpecifications.create(
      {
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
  } catch (error) {
    throw error;
  }
};

export const getCarListingService = async ({ carListingId, userId }) => {
  try {
    const carListing = await CarListing.findByPk(carListingId);

    if (!carListing) {
      throw new AppError('Car Listing doesnt exist');
    }
    const carSpecifications = await CarSpecifications.findOne({
      where: {
        carListingId: carListingId,
      },
    });

    if (!carSpecifications) {
      throw new AppError('Car specifications dont exist');
    }

    const isLiked = await CarListingLike.count({
      where: { userId: userId, carListingId: carListing.id },
    });
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

    return carData;
  } catch (error) {
    throw error;
  }
};

export const getSellerDataService = async ({ carListingId }) => {
  try {
    const carListing = await CarListing.findByPk(carListingId);
    const userId = carListing.userId;
    const user = await User.findByPk(userId);

    const userListingsCount = await CarListing.count({
      where: {
        userId: userId,
      },
    });

    const accountAge = user.createdAt.getFullYear();

    const sellerData = {
      firstName: user.firstName,
      lastName: user.lastName,
      accountAge: accountAge,
      numOfListings: userListingsCount,
    };
    return sellerData;
  } catch (error) {
    throw error;
  }
};
