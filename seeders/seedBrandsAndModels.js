import Brand from "#/models/Brand.js";
import CarModel from "#/models/CarModel.js";

const carData = {
  Toyota: ["Corolla", "Camry", "RAV4"],
  BMW: ["3 Series", "X5", "i4"],
  Ford: ["Focus", "Mustang", "F-150"],
};

const BASE_URL = 'https://parseapi.back4app.com/classes/Car_Model_List';
const HEADERS = {
  'X-Parse-Application-Id': 'hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z',
  'X-Parse-Master-Key': 'SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW',
  'Accept': 'application/json',
};

async function seedBrandsAndModels() {
  const rows = await fetchAllRows();
  const makes = normalize(rows);

  const brandRows = [...makes.keys()].map((name) => ({ name }));

  await Brand.bulkCreate(brandRows, {
    ignoreDuplicates: true,
  });

  const brands = await Brand.findAll({
    attributes: ["id", "name"],
  });

  const brandIdByName = new Map(
    brands.map((brand) => [brand.name, brand.id])
  );
  const modelRows = [];

  for (const [makeName, modelSet] of makes) {
    const brandId = brandIdByName.get(makeName);
    if (!brandId) continue;

    for (const modelName of modelSet) {
      modelRows.push({
        name: modelName,
        brandId,
      });
    }
  }
  await CarModel.bulkCreate(modelRows, {
    ignoreDuplicates: true,
  });
  console.log(`Seeded ${brandRows.length} brands and ${modelRows.length} models.`);
}

async function fetchAllRows() {
  const limit = 1000;
  let skip = 0;
  const allRows = [];

  while (true) {
    const url = `${BASE_URL}?limit=${limit}&skip=${skip}&keys=Make,Model`;
    const res = await fetch(url, { headers: HEADERS });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rows = data.results || [];

    allRows.push(...rows);

    console.log(`Fetched ${rows.length} rows at skip=${skip}`);

    if (rows.length < limit) break;
    skip += limit;
  }

  return allRows;
}

function normalize(rows) {
  const makes = new Map();

  for (const row of rows) {
    const make = row.Make?.trim();
    const model = row.Model?.trim();
    if (!make || !model) continue;

    if (!makes.has(make)) makes.set(make, new Set());
    makes.get(make).add(model);
  }
  return makes;
}

seedBrandsAndModels();
