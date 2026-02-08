import Brand from "../../models/Brand.js";
import CarModel from "../../models/CarModel.js";

export const getCarBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();

    return res
      .status(200)
      .json({ brandNames: brands.map((brand) => brand.name) });
  } catch (error) {
    console.error("Error fetching car brands:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBrandModels = async (req, res) => {
  try {
    const brand = req.query.brand;

    const carBrand = await Brand.findOne({
      where: { name: brand },
      attributes: ["id"],
    });

    if (!carBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const carModels = await CarModel.findAll({
      where: { brandId: carBrand.id },
    });

    return res
      .status(200)
      .json({ brandModels: carModels.map((model) => model.name) });
  } catch (e) {
    console.error("Error fetching car Models:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
