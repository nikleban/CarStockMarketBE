import Brand from '#/models/Brand.js';
import CarModel from '#/models/CarModel.js';
import { createRequire } from 'module';

const MISSING_BRANDS_AND_MODELS = {
  BMW: ['1 Series', '2 Series', '4 Series', '7 Series', '8 Series'],
  Volkswagen: ['up!', 'Touran', 'Tayron', 'Transporter', 'T-Roc'],
};

async function seedBrandsAndModels() {
  const require = createRequire(import.meta.url);
  const rows = require('./all-vehicles-model.json');

  const makes = new Map();
  for (const row of rows) {
    const make = row.make?.trim();
    const model = row.model?.trim();
    if (!make || !model) continue;
    if (!makes.has(make)) makes.set(make, new Set());
    makes.get(make).add(model);
  }

  for (const [brand, models] of Object.entries(MISSING_BRANDS_AND_MODELS)) {
    if (!makes.has(brand)) makes.set(brand, new Set());
    for (const model of models) makes.get(brand).add(model);
  }

  const brandRows = [...makes.keys()].map((name) => ({ name }));
  await Brand.bulkCreate(brandRows, { ignoreDuplicates: true });

  const brands = await Brand.findAll({ attributes: ['id', 'name'] });
  const brandIdByName = new Map(brands.map((b) => [b.name, b.id]));

  const modelRows = [];
  for (const [makeName, modelSet] of makes) {
    const brandId = brandIdByName.get(makeName);
    if (!brandId) continue;
    for (const modelName of modelSet) {
      modelRows.push({ name: modelName, brandId });
    }
  }

  await CarModel.bulkCreate(modelRows, {
    ignoreDuplicates: true,
    conflictFields: ['name', 'brandId'],
  });
  console.log(`Seeded ${brandRows.length} brands and ${modelRows.length} models.`);
}

seedBrandsAndModels();
