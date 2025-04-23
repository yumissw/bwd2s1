import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

interface RefreshTokenAttributes {
  id: number;
  token: string;
  expires_at: Date;
  userId: number;
}

class RefreshToken
  extends Model<RefreshTokenAttributes>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare token: string;
  declare expires_at: Date;
  declare userId: number;
}

// структура модели
RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true, 
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refreshTokens", 
    timestamps: true, //  Добавляет поля createdAt и updatedAt
  },
);

export default RefreshToken;
export const syncModel = async () => {
  try {
    await RefreshToken.sync(); // создает таблицу, если она не существует
    console.log('таблица "refreshtokens" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "refreshtokens":', error);
  }
};
