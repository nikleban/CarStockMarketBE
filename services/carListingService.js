import CarListing from "#/models/CarListing.js";
import CarListingLike from "#/models/CarListingLike.js";
import CarModel from "#/models/CarModel.js";
import Brand from "#/models/Brand.js";
import { buildWhereFiltersCarListings } from "#/utils/carListingUtils.js";

export const getCarListingsService = async ({ query, user }) => {
  try {
    const page = Number(query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const userId = user.id;

    const { whereCarListing, whereCarSpecifications, whereBrand, whereCarModel } = buildWhereFiltersCarListings(query);

    const hasBrandFilter = Object.keys(whereBrand).length > 0;
    const hasModelFilter = Object.keys(whereCarModel).length > 0;

    const carListings = await CarListing.findAll({
        limit,
        offset,
        subQuery: false,
        order: [["createdAt", "DESC"]],
        include: [{
            model: CarModel,
            attributes: ["name"],
            where: hasModelFilter ? whereCarModel : undefined,
            required: hasBrandFilter || hasModelFilter,
            include: [{
                model: Brand,
                attributes: ["name"],
                where: hasBrandFilter ? whereBrand : undefined,
                required: hasBrandFilter,
            }],
        },
        {
            model: CarListingLike,
            as: "liked",
            where: { userId: userId },
            required: false
        }],
        where: whereCarListing,
    });

    const formatted = carListings.map((listing) => {
        const json = listing.toJSON();

        return {
            ...json,
            liked: json.liked?.length > 0
        };
    });
    return formatted;
  } catch (error) {
    throw error;
  }
}