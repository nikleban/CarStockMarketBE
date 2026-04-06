import bcrypt from "bcrypt";
import User from "#/models/User.js";
import {
  MissingUserDataError,
  UserAlreadyExistsError,
} from "#/errors/index.js";
import jwt from "jsonwebtoken";
import CarListing from "../../models/CarListing.js";
import { AppError } from "#/errors/index.js";
import CarListingLike from "#/models/CarListingLike.js";
import Brand from "#/models/Brand.js";
import CarModel from "#/models/CarModel.js";
import { literal } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res, next) => {
  try {
    console.log("what")
    const { firstName, lastName, email, telephone, password } = req.body;

    if (!firstName || !lastName || !email || !telephone || !password) {
      throw new MissingUserDataError();
    }

    const doesUserExist = await User.findOne({ where: { email } });
    if (doesUserExist) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      telephone,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new MissingUserDataError();
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User loged in successfully",
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
    message: "User loged in successfully",
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
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      throw UserDoesntExist();
    }

    const carListingsMade = await CarListing.count({ where: { userId: userId } })
    const userActiveYear = user.createdAt.getFullYear();

    if (userId !== currentUserId) {
      //return limited data, private data stays
    }
    
    const totalLikes = await CarListingLike.count({where: { userId: user.id }});
    
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
}

export const getUserCarListings = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const carListings = await CarListing.findAll({
      where: {userId: userId},
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "CarListingLikes" AS cl
              WHERE cl."carListingId" = "CarListing"."id"
            )`),
            "likes"
          ]
        ],
      },
      include: [{
          model: CarModel,
          attributes: ["name"],
          include: [{
              model: Brand,
              attributes: ["name"]
          }],
      },]
    })

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
    })

    return res.status(201).json(formatted);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export const getUserLikedCarListings = async (req, res, next) => {
  const { id: userId } = req.params;
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
      include: [{
          model: CarModel,
          attributes: ["name"],
          include: [{
              model: Brand,
              attributes: ["name"]
          }],
      },]
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
    })

    return res.status(201).json(formatted);
  } catch (error) {
    console.log(error);
    next(error);
  }
}