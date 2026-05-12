import {
  getCarListingService,
  getCarListingsService,
  createCarListingService,
  getSellerDataService,
} from '#/services/carListingService.js';
import CarListing from '#/models/CarListing.js';
import { sequelize } from '#/models/index.js';
import {
  createCarListing,
  carListingAttrs,
  createCarModel,
  createUser,
  carSpecificationsAttrs,
} from '#/tests/factories/carListingFactory';
import { faker } from '@faker-js/faker';
import { MissingCarListingDataError } from '#/errors/CarListingError.js';
beforeEach(async () => {
  await CarListing.destroy({ where: {}, truncate: true, cascade: true, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// getCarListingService
test('gets a car listing service', async () => {
  const listing = await createCarListing();
  const getListing = await getCarListingService({
    carListingId: listing.id,
    userId: listing.userId,
  });
  expect(listing.id).toBe(getListing.id);
});

test('get car listing service raise not found', async () => {
  expect(async () => {
    await getCarListingService({
      carListingId: faker.string.uuid,
      userId: faker.string.uuid,
    });
  }).rejects.toThrow();
});

test('get car listing service raise car specification not found', async () => {
  await createCarListing({}, true);
  expect(async () => {
    await getCarListingService({
      carListingId: faker.string.uuid,
      userId: faker.string.uuid,
    });
  }).rejects.toThrow();
});

// getCarListingService
test('gets car listings service', async () => {
  const listing = await createCarListing();
  await createCarListing();
  const getListings = await getCarListingsService({
    query: {
      page: 1,
    },
    userId: listing.userId,
  });
  expect(getListings.length).toBe(2);
});

test('gets car listings service raise missing param error', async () => {
  expect(async () => {
    await getCarListingsService({});
  }).rejects.toThrow(MissingCarListingDataError);
});

// createCarListingService
test('creates car listings service', async () => {
  const user = await createUser();
  const carSpecfications = carSpecificationsAttrs();
  let data = carListingAttrs({
    photos: null,
    price: 20_000,
    vinNumber: '123321',
    ...carSpecfications,
  });
  await createCarModel({ name: 'fufi' });
  data = {
    ...data,
    brandModel: 'fufi',
  };
  await createCarListingService({
    data,
    photos: [faker.image.url()],
    userId: user.id,
  });
  const exists = (await CarListing.count({ where: { userId: user.id } })) > 0;
  expect(exists).toBe(true);
});

// getSellerDataService
test('gets car listing seller', async () => {
  const carListing = await createCarListing();
  const seller = await getSellerDataService({ carListingId: carListing.id });
  expect(seller.numOfListings).toBe(1);
});
