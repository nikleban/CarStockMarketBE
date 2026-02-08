import Brand from "../models/Brand.js";
import CarModel from "../models/CarModel.js";

const carData = {
  Toyota: ["Corolla", "Camry", "RAV4"],
  BMW: ["3 Series", "X5", "i4"],
  Ford: ["Focus", "Mustang", "F-150"],
};

async function seedBrandsAndModels() {
  try {
    const brandNames = Object.keys(carData);
    const brandRecords = brandNames.map((name) => ({ name }));
    const brands = await Brand.bulkCreate(brandRecords);

    const carModels = [];
    for (const brand of brands) {
      const models = carData[brand.name];
      for (const modelName of models) {
        carModels.push({
          name: modelName,
          brandId: brand.id,
        });
      }
    }

    await CarModel.bulkCreate(carModels);
    console.log("✅ Brands and car models seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedBrandsAndModels();
