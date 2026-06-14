import express from 'express';
import upload from '#/middlewares/MulterUpload.js';
import protect, { optionalAuth } from '#/middlewares/AuthMiddleware.js';
import {
  createCarListing,
  getCarListings,
  getCarListing,
  getSellerData,
  getFeaturedCarListings,
} from '#/controllers/CarListing/CarListingController.js';
import {
  createCarListingLike,
  deleteCarListingLike,
} from '#/controllers/CarListing/CarListingLikeController.js';

const router = express.Router();

router.post('/carListing', protect, upload.array('photos', 10), createCarListing);
router.get('/carListings', optionalAuth, getCarListings);
router.get('/carListing/:id', optionalAuth, getCarListing);
router.get('/featuredCarListings', optionalAuth, getFeaturedCarListings);
router.get('/carListing/sellerData/:id', optionalAuth, getSellerData);
router.post('/carListing/:id/like', protect, createCarListingLike);
router.delete('/carListing/:id/like', protect, deleteCarListingLike);

export default router;
