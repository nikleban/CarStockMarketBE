import User from '#/models/User.js';
import {
  sendVerificationCodeService,
  loginUserService,
  registerUserService,
  getUserService,
  getUserCarListingsService,
  getUserLikedCarListingsService,
} from '#/services/userService.js';

export const sendVerificationCode = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    await sendVerificationCodeService({ email: email, firstName: name });
    return res.status(201).json({
      ok: true,
      received: req.body,
    });
  } catch (error) {
    return next(error);
  }
};

export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, telephone, password, verificationCode } = req.body;
  try {
    const { user, token } = await registerUserService(
      firstName,
      lastName,
      email,
      telephone,
      password,
      verificationCode
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        telephone: user.telephone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await loginUserService({ email: email, password: password });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'User loged in successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        telephone: user.telephone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWithToken = async (req, res) => {
  const userEmail = req.user.email;

  const user = await User.findOne({ where: { email: userEmail } });

  return res.status(201).json({
    message: 'User loged in successfully',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephone: user.telephone,
    },
  });
};

export const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'User logged out successfully' });
};

export const getUser = async (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.user.id;
  try {
    const { user, carListingsMade, userActiveYear, totalLikes } = await getUserService({
      userId: userId,
      currentUserId: currentUserId,
    });

    return res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephone: user.telephone,
      soldCars: user.soldCars,
      activeListings: carListingsMade,
      activeSinceYear: userActiveYear,
      totalLikes: totalLikes,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCarListings = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const carListings = await getUserCarListingsService({ userId: userId });
    return res.status(201).json(carListings);
  } catch (error) {
    next(error);
  }
};

export const getUserLikedCarListings = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const likedCarListings = await getUserLikedCarListingsService({ userId: userId });
    return res.status(201).json(likedCarListings);
  } catch (error) {
    next(error);
  }
};
