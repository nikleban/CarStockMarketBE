import User from '#/models/User.js';
import CarListing from '#/models/CarListing.js';
import CarListingLike from '#/models/CarListingLike.js';
import CarModel from '#/models/CarModel.js';
import Brand from '#/models/Brand.js';

import {
  UserAlreadyExistsError,
  MissingUserDataError,
  InvalidVerificationCodeError,
  UserDoesntExist,
} from '#/errors/index.js';
import emailQueue from '#/modules/email/emailQueue.js';
import redisClient from '#/modules/redis/redisClient.js';
import { AppError } from '#/errors/index.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { literal } from 'sequelize';

export const sendVerificationCodeService = async ({ email, firstName }) => {
  const doesUserExist = await User.findOne({ where: { email } });

  if (doesUserExist) {
    throw new UserAlreadyExistsError();
  }

  const code = Math.floor(Math.random() * 900000) + 100000;

  await redisClient.set(`verification:${email}`, code, 'EX', 600);
  await emailQueue.add('verificationCode', {
    type: 'verificationCode',
    to: email,
    userName: firstName,
    verificationCode: code,
  });
};

export const registerUserService = async (
  firstName,
  lastName,
  email,
  telephone,
  password,
  verificationCode
) => {
  try {
    if (!firstName || !lastName || !email || !telephone || !password || !verificationCode) {
      throw new MissingUserDataError();
    }

    const storedCode = await redisClient.get(`verification:${email}`);

    if (storedCode !== verificationCode) {
      throw new InvalidVerificationCodeError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      telephone,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const loginUserService = async ({ email, password }) => {
  try {
    if (!email || !password) {
      throw new MissingUserDataError();
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    await emailQueue.add('login', { type: 'login', to: user.email, userName: user.firstName });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const getUserService = async ({ userId, currentUserId }) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw UserDoesntExist();
    }

    const carListingsMade = await CarListing.count({ where: { userId: userId } });
    const userActiveYear = user.createdAt.getFullYear();

    if (userId !== currentUserId) {
      //return limited data, private data stays
    }

    const totalLikes = await CarListingLike.count({ where: { userId: user.id } });
    return { user, carListingsMade, userActiveYear, totalLikes };
  } catch (error) {
    throw error;
  }
};

export const getUserCarListingsService = async ({ userId }) => {
  try {
    const carListings = await CarListing.findAll({
      where: { userId: userId },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "CarListingLikes" AS cl
              WHERE cl."carListingId" = "CarListing"."id"
            )`),
            'likes',
          ],
        ],
      },
      include: [
        {
          model: CarModel,
          attributes: ['name'],
          include: [
            {
              model: Brand,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    const formatted = carListings.map((listing) => {
      const json = listing.toJSON();
      return {
        id: listing.id,
        brand: json.CarModel.Brand.name,
        model: json.CarModel.name,
        createdAt: listing.createdAt,
        description: listing.description,
        fuel: listing.fuel,
        horsepower: listing.horsepower,
        kilowatts: listing.kilowatts,
        mileage: listing.mileage,
        photos: listing.photos,
        price: listing.price,
        registrationMonth: listing.registrationMonth,
        registrationYear: listing.registrationYear,
        likes: json.likes,
      };
    });
    return formatted;
  } catch (error) {
    throw error;
  }
};
//TODO: check if good
export const getUserLikedCarListingsService = async ({ userId }) => {
  try {
    const likedCarListingIds = await CarListingLike.findAll({
      where: { userId },
      attributes: ['carListingId'],
      raw: true,
    });

    const ids = likedCarListingIds.map((row) => row.carListingId);

    const carListings = await CarListing.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: CarModel,
          attributes: ['name'],
          include: [
            {
              model: Brand,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    const formatted = carListings.map((listing) => {
      const json = listing.toJSON();
      return {
        id: listing.id,
        brand: json.CarModel.Brand.name,
        model: json.CarModel.name,
        createdAt: listing.createdAt,
        description: listing.description,
        fuel: listing.fuel,
        horsepower: listing.horsepower,
        kilowatts: listing.kilowatts,
        mileage: listing.mileage,
        photos: listing.photos,
        price: listing.price,
        registrationMonth: listing.registrationMonth,
        registrationYear: listing.registrationYear,
        liked: true,
      };
    });
    return formatted;
  } catch (error) {
    throw error;
  }
};
