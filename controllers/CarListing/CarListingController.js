import {
  getCarListingsService,
  createCarListingService,
  getCarListingService,
  getSellerDataService,
  getFeaturedCarListingsService,
} from '#/services/carListingService.js';

export const createCarListing = async (req, res, next) => {
  try {
    await createCarListingService({ data: req.body, photos: req.files, userId: req.user.id });
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
    const userId = req.user?.id ?? null;
    const carListings = await getCarListingsService({ query: req.query, userId: userId });
    return res.status(200).json(carListings);
  } catch (error) {
    return next(error);
  }
};

export const getCarListing = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const carListing = await getCarListingService({
      carListingId: req.params.id,
      userId: userId,
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

export const getFeaturedCarListings = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const sellerData = await getFeaturedCarListingsService({ userId: userId });
    return res.status(200).json(sellerData);
  } catch (error) {
    return next(error);
  }
};
