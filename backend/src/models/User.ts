import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  
  lastName: string;
  firstName: string;
  patronymic: string;
  gender: 'male' | 'female' | 'other'; 
  dateOfBirth: Date;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare lastName: string;
  declare firstName: string;
  declare patronymic: string;
  declare gender: 'male' | 'female' | 'other'; 
  declare dateOfBirth: Date;
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
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patronymic:{
      type: DataTypes.STRING,
            allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
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
