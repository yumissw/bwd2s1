import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

interface EventAttributes {
  id: number;
  title: string;
  description: string;
  date: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
class Event extends Model<EventAttributes> implements EventAttributes {
  declare id: number;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare createdBy: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// структура модели
Event.init(
  {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true, 
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
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
    modelName: "Event", 
    tableName: "events", 
    timestamps: true, // включение поля createdAt и updatedAt
  },
);

export default Event;
export const syncModel = async () => {
  try {
    await Event.sync(); // создает таблицу, если она не существует
    console.log('таблица "events" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "events":', error);
  }
};
