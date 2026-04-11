import express from "express";
import cors from "cors";
import errorHandler from "#/middlewares/ErrorHandler.js";
import cookieParser from "cookie-parser";
import userRoutes from "#/routes/userRoutes.js";
import carRoutes from "#/routes/carRoutes.js";
import listingRoutes from "#/routes/listingRoutes.js";
import protect from "#/middlewares/AuthMiddleware.js";
import "#/modules/email/emailWorker.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend’s exact URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
// for test
app.get("/", (req, res) => res.send("API running"));

app.use("/api/users", userRoutes);
app.use("/api/cars", protect, carRoutes);
app.use("/api/listings", protect, listingRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => res.send("API running"));

app.use(errorHandler);

export default app;