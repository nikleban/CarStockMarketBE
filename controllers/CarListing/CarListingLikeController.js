import CarListingLike from "#/models/CarListingLike.js";


export const createCarListingLike = async (req, res, next) => {
  const userId = req.user.id;
  const { id: carListingId } = req.params;
  try {
    const likeExists = await CarListingLike.findOne({ where: { carListingId: carListingId, userId: userId } });

    if (likeExists) {
      return res.sendStatus(200);
    }

    await CarListingLike.create({
      carListingId: carListingId,
      userId: userId,
    })
    return res.sendStatus(200);
  } catch (error) {
      console.log(error);
      next(error);
  }
}

export const deleteCarListingLike = async (req, res, next) => {
  const userId = req.user.id;
  const { id: carListingId } = req.params;
  try {
    const likeExists = await CarListingLike.findOne({ where: { carListingId: carListingId, userId: userId } });

    if (!likeExists) {
      return res.sendStatus(200);
    }

    await CarListingLike.destroy({ where: {
      carListingId: carListingId,
      userId: userId,
    }});
    return res.sendStatus(200);
  } catch (error) {
      console.log(error);
      next(error);
  }
}