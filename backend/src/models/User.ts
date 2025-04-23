import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// структура модели
User.init(
  {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true, 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, // передача экземпляра sequelize
    modelName: "User", 
    tableName: "users", 
    timestamps: true, // включение полей createdAt и updatedAt\
  },
);

export default User;
export const syncModel = async () => {
  try {
    await User.sync(); // создает таблицу, если она не существует
    console.log('таблица "users" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "users":', error);
  }
};
