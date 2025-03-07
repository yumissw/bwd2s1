const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // импортирт sequelize
//const {User} = require('./User'); // импортирт модели User

class Event extends Model {}

// структура модели
Event.init({
    id: {
        type: DataTypes.INTEGER, // тип данных
        autoIncrement: true, // создавать автоматически
        primaryKey: true, // первичный ключ
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false, // поле обязательно
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // поле не обязательно
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
       /* references: {
            model: User,
            key: 'id',
        }, */// определение внешнего ключа
        
    },
}, {
    sequelize, // передача экземпляра sequelize
    modelName: 'Event', // имя модели
    tableName: 'events', // имя таблицы в базе данных
    timestamps: true, // включение поля createdAt и updatedAt
});

console.log('лялялял')
// синхронизация модели с базой данных
const syncModel = async () => {
    try {
        await Event.sync(); // создает таблицу, если она не существует
        console.log('таблица "events" успешно синхронизирована.');
    } catch (error) {
        console.error('ошибка при синхронизации таблицы "events":', error);
    }
}

// экспорт модели
module.exports = { Event, syncModel };