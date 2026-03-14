import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "#/models/index.js";
import "source-map-support/register.js";
import userRoutes from "#/routes/userRoutes.js";
import carRoutes from "#/routes/carRoutes.js";
import listingRoutes from "#/routes/listingRoutes.js";
import cookieParser from "cookie-parser";
import protect from "#/middlewares/AuthMiddleware.js";
import errorHandler from "#/middlewares/ErrorHandler.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend’s exact URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/cars", protect, carRoutes);
app.use("/api/listings", protect, listingRoutes);
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => res.send("API running"));

app.use(errorHandler);

const startServer = async () => {
  try {
    sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true }); //force: true to delete and create

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();
