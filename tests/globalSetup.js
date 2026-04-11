import { sequelize } from "../models/index.js";

 export default async function globalSetup() {
   await sequelize.sync({ force: true });
   await sequelize.close();
 }