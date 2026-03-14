import Brand from "#/models/Brand.js";
import CarModel from "#/models/CarModel.js";
import { BrandNotFoundError } from "#/errors/index.js";

export const getCarBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();

    return res
      .status(200)
      .json({ brandNames: brands.map((brand) => brand.name) });
  } catch (error) {
    next(error)
  }
};

export const getBrandModels = async (req, res, next) => {
  try {
    const brand = req.query.brand;

    const carBrand = await Brand.findOne({
      where: { name: brand },
      attributes: ["id"],
    });

    if (!carBrand) throw new BrandNotFoundError();

    const carModels = await CarModel.findAll({
      where: { brandId: carBrand.id },
    });

    return res
      .status(200)
      .json({ brandModels: carModels.map((model) => model.name) });
  } catch (error) {
    return next(error)
  }
};
