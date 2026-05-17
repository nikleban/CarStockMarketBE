import Brand from '#/models/Brand.js';
import CarModel from '#/models/CarModel.js';
import { createRequire } from 'module';

const MISSING_BRANDS_AND_MODELS = {
  BMW: ['1 Series', '2 Series', '4 Series', '7 Series', '8 Series', 'Z4Z4'],
  Volkswagen: [
    'up!',
    'Touran',
    'Caddy',
    'Sharan',
    'Tayron',
    'Taigo',
    'Transporter',
    'T-Roc',
    'T-Cross',
    'Polo',
    'Amarok',
    'Multivan',
    'California',
  ],
  Audi: ['A1', 'A2', 'Q2'],
  Toyota: ['Avensis', 'Verso-S', 'Proace', 'Aygo', 'Hilux', 'IQ'],
  Renault: [
    'Scenic',
    'Modus',
    'Austral',
    'Clio',
    'Meganetechno',
    'Twingo',
    'Megane',
    'Captur',
    'Talisman',
    'ZoeBose',
    'LagunaElite',
    'LagunaPrivil',
    'LagunaExpression',
    'Espaced',
    'R4',
    'Koleos',
    'SymbiozE',
    'Kadjar',
    'Kangoo',
    'Fluence',
    'Thalia',
  ],
  Peugeot: [
    '206',
    '206',
    '301',
    '3008',
    '5008',
    '504',
    '408',
    '308',
    '307',
    '208',
    '107',
    '207',
    'Partner',
    'Rifter',
  ],
  Ford: ['Galaxy', 'Mondeo', 'Puma', 'S-Max', 'Kuga', 'Tourneo', 'Grand', 'Ka'],
  'Mercedes-Benz': ['GLE-class', 'Vito'],
  Citroën: [
    '2 CV',
    'Ami',
    'AX',
    'Berlingo',
    'BX',
    'C1',
    'C2',
    'C3',
    'C3 Aircross',
    'C3 Picasso',
    'C3 Pluriel',
    'C4',
    'C4 Aircross',
    'C4 Cactus',
    'C4 Picasso (vsi)',
    'C4 Picasso',
    'C4 Grand Picasso',
    'C4 SpaceTourer (vsi)',
    'C4 SpaceTourer',
    'C4 Grand SpaceTourer',
    'C4 X',
    'C5',
    'C5 Aircross',
    'C5 X',
    'C6',
    'C8',
    'C-Crosser',
    'C-Elysee',
    'C-Zero',
    'CX',
    'CitroenDS',
    'DS3',
    'DS4',
    'DS5',
    'Dyane',
    'Evasion',
    'GS',
    'GSA',
    'Jumpy',
    'LN',
    'Nemo',
    'Saxo',
    'SM',
    'SpaceTourer',
    'Visa',
    'Xantia',
    'CitroenXM',
    'Xsara',
    'Xsara Picasso',
    'ZX',
  ],
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
