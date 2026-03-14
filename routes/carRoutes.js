import express from "express";
import {
  getCarBrands,
  getBrandModels,
} from "#/controllers/Car/brandController.js";

const router = express.Router();

router.get("/brands", getCarBrands);
router.get("/brandModels", getBrandModels);

export default router;
