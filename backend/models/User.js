const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // импортирт sequelize
//const {Event} = require('./Event'); // импорт модели Event
const bcrypt = require("bcryptjs");

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
      unique: true, // Важно: Уникальность email
    },
    password: {
      type: DataTypes.STRING,
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
    timestamps: true, // включение полей createdAt и updatedAt\
    /*hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          //Хешируем только если пароль изменился
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },*/
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
