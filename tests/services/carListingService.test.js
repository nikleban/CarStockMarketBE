import { getCarListingsService, createCarListingService, getCarListingService, getSellerDataService} from "#/services/carListingService.js";
import CarListing from "#/models/CarListing.js";
import { sequelize } from "#/models/index.js";
import { createCarListing } from "#/tests/factories/carListingFactory";

beforeEach(async () => {
  await CarListing.destroy({ where: {}, truncate: true, cascade: true, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('gets a car listing service', async () => {
  const listing = await createCarListing();
  const getListing = await getCarListingService({carListingId: listing.id, userId: listing.userId});
  expect(listing.id).toBe(getListing.id);
})