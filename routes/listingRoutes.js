import express from "express";
import upload from "#/middlewares/MulterUpload.js"
import { createCarListing, getCarListings, getCarListing, getSellerData } from "#/controllers/CarListing/CarListingController.js";
import { createCarListingLike, deleteCarListingLike } from "#/controllers/CarListing/CarListingLikeController.js";

const router = express.Router();

router.post("/carListing", upload.array("photos", 10), createCarListing);
router.get("/carListings", getCarListings);
router.get("/carListing/:id", getCarListing);
router.get("/carListing/sellerData/:id", getSellerData);
router.post("/carListing/:id/like", createCarListingLike);
router.delete("/carListing/:id/like", deleteCarListingLike);


export default router;
