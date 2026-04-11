import { faker } from '@faker-js/faker';
import CarListing from '#/models/CarListing.js';
import CarSpecifications from '#/models/CarSpecifications.js';
import CarModel from '#/models/CarModel.js';
import Brand from '#/models/Brand.js';
import User from '#/models/User.js';
import { VEHICLE_FUEL_TYPES, VEHICLE_SHAPE_CHOICES } from '#/models/const.js';

const fuelTypes = Object.values(VEHICLE_FUEL_TYPES);
const vehicleShapes = Object.values(VEHICLE_SHAPE_CHOICES);

export function carListingAttrs(overrides = {}) {
  return {
    price: faker.number.int({ min: 1000, max: 200_000 }),
    kilowatts: faker.number.int({ min: 40, max: 600 }),
    fuel: faker.helpers.arrayElement(fuelTypes),
    mileage: faker.number.int({ min: 0, max: 300_000 }),
    registrationYear: faker.number.int({ min: 2000, max: new Date().getFullYear() }),
    registrationMonth: faker.number.int({ min: 1, max: 12 }),
    photos: [faker.image.url()],
    description: faker.lorem.sentence(),
    ...overrides,
  };
}

export async function createUser(overrides = {}) {
  return User.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    telephone: faker.phone.number(),
    password: faker.internet.password(),
    ...overrides,
  });
}

export async function createBrand(overrides = {}) {
  return Brand.create({
    name: faker.vehicle.manufacturer() + faker.string.alphanumeric(4),
    ...overrides,
  });
}

export async function createCarModel(overrides = {}) {
  const brand = overrides.brandId ? null : await createBrand();
  return CarModel.create({
    name: faker.vehicle.model() + faker.string.alphanumeric(4),
    brandId: brand?.id,
    ...overrides,
  });
}

export function carSpecificationsAttrs(overrides = {}) {
  return {
    vehicleShape: faker.helpers.arrayElement(vehicleShapes),
    color: faker.color.human(),
    numOfDoors: faker.number.int({ min: 2, max: 5 }),
    numOfSeats: faker.number.int({ min: 2, max: 7 }),
    fuelConsumption: faker.number.int({ min: 3, max: 20 }),
    motorVolumeFrom: faker.number.int({ min: 800, max: 2000 }),
    motorVolumeTo: faker.number.int({ min: 2000, max: 5000 }),
    vinNumber: faker.vehicle.vin(),
    numOfOwners: faker.number.int({ min: 0, max: 5 }),
    technicalValidity: faker.date.future(),
    ...overrides,
  };
}

/**
 * Creates a CarListing with all required associations (User, Brand, CarModel, CarSpecifications).
 * Pass `overrides` to pin specific field values.
 *
 * @example
 * const listing = await createCarListing({ price: 5000 });
 * const listing = await createCarListing({ userId: existingUser.id, carModelId: existingModel.id });
 */
export async function createCarListing(overrides = {}) {
  const user = overrides.userId ? null : await createUser();
  const carModel = overrides.carModelId ? null : await createCarModel();

  const listing = await CarListing.create({
    ...carListingAttrs(),
    userId: user?.id,
    carModelId: carModel?.id,
    ...overrides,
  });

  await CarSpecifications.create({
    ...carSpecificationsAttrs(),
    carListingId: listing.id,
  });

  return listing;
}
