const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // импортирт sequelize
//const {Event} = require('./Event'); // импорт модели Event

class User extends Model {}

// структура модели
User.init(
  {
    id: {
      type: DataTypes.INTEGER, // тип данных
      autoIncrement: true, // создавать автоматически
      primaryKey: true, // первичный ключ
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // поле обязательно (true - обязательно)
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      // Добавляем определение поля createdAt
      type: DataTypes.DATE,
    },
    updatedAt: {
      // Добавляем определение поля updatedAt
      type: DataTypes.DATE,
    },
    /*createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    */
  },
  {
    sequelize, // передача экземпляра sequelize
    modelName: "User", // имя модели
    tableName: "users", // имя таблицы в базе данных
    timestamps: true, // включение полей createdAt и updatedAt
  }
);

// синхронизация модели с базой данных
const syncModel = async () => {
  try {
    await User.sync(); // создает таблицу, если она не существует
    console.log('таблица "users" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "users":', error);
  }
};

// экспорт модели
module.exports = { User, syncModel };
//module.exports = User;
