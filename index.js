import dotenv from "dotenv";
import { sequelize } from "#/models/index.js";
import "source-map-support/register.js";
import app from "#/app.js";

dotenv.config({ quiet: true });

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true }); //force: true to delete and create

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();
