const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // импортирт sequelize

class RefreshToken extends Model {}

// структура модели
RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER, // тип данных
      autoIncrement: true, // создавать автоматически
      primaryKey: true, // первичный ключ
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
      // Связь с таблицей пользователей
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refreshTokens", //  Опционально, если хотите задать имя таблицы явно
    timestamps: true, //  Добавляет поля createdAt и updatedAt
  }
);

// синхронизация модели с базой данных
const syncModel = async () => {
  try {
    await RefreshToken.sync(); // создает таблицу, если она не существует
    console.log('таблица "refreshtokens" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "refreshtokens":', error);
  }
};

module.exports = { RefreshToken, syncModel };
