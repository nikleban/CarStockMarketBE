import express from "express";
import { createCarListing } from "../controllers/CarListing/CarListingController.js";

const router = express.Router();

router.post("/carListing", createCarListing);

export default router;
