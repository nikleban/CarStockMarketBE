import { DataTypes } from 'sequelize';
import sequelize from '#/config/db.js';

const UserSetting = sequelize.define(
  'UserSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en',
    },
  },
  { timestamps: true }
);

export default UserSetting;
