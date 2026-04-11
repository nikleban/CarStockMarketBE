import {
  getCarListingsService,
  createCarListingService,
  getCarListingService,
  getSellerDataService,
} from '#/services/carListingService.js';

export const createCarListing = async (req, res, next) => {
  try {
    await createCarListingService({ data: req.body, photos: req.files });
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
    const carListings = await getCarListingsService({ query: req.query, user: req.user });
    return res.status(200).json(carListings);
  } catch (error) {
    return next(error);
  }
};

export const getCarListing = async (req, res, next) => {
  try {
    const carListing = await getCarListingService({
      carListingId: req.params.id,
      userId: req.user.id,
    });
    return res.status(200).json(carListing);
  } catch (error) {
    return next(error);
  }
};

export const getSellerData = async (req, res, next) => {
  try {
    const sellerData = await getSellerDataService({ carListingId: req.params.id });
    return res.status(200).json(sellerData);
  } catch (error) {
    return next(error);
  }
};
