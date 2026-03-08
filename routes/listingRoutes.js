import express from "express";
import upload from "../middlewares/MulterUpload.js"
import { createCarListing, getCarListings, getCarListing } from "../controllers/CarListing/CarListingController.js";

const router = express.Router();

router.post("/carListing", upload.array("photos", 10), createCarListing);
router.get("/carListings", getCarListings);
router.get("/carListing/:id", getCarListing);

export default router;
