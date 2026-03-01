import bcrypt from "bcrypt";
import User from "../../models/User.js";
import {
  MissingUserDataError,
  UserAlreadyExistsError,
} from "../../errors/index.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/index.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res, next) => {
  try {
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
