


export const createCarListingLike = async (req, res, next) => {
  const userId = req.user.id;
  const { id: carListingId } = req.params;
  try {


  } catch (error) {
      console.log(error);
      next(error);
  }
}