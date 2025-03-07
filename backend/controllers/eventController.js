const { Event } = require('../models/Event');
const { User } = require('../models/User');


require('dotenv').config(); //новое

// Create a new event
const createEvent = async (req, res) => {
    const { title, date, createdBy } = req.body;

    // проверка обязательных данных
    if (!title || !date || !createdBy) {
        return res.status(400).json({ message: 'не все обязательные поля указаны' });
    }

    try {

        // проверка существования пользователя
        const existingUser = await User.findOne({ where: { id: createdBy } });
        if (!existingUser) {
            return res.status(404).json({ message: 'пользователя не существует' });
        }

        const eventData = req.body;
        const newEvent = await Event.create(eventData);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при создании мероприятия', details: error.message });
    }
};





// Get all events
/*const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении мероприятий', details: error.message });
    }
};*/

//новое
const getEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let whereClause = {}; // Создаем пустой объект для условий WHERE

        if (startDate && endDate) {
            // Если переданы startDate и endDate, добавляем условие для фильтрации по дате
            whereClause = {
                date: {
                    [require('sequelize').Op.gte]: new Date(startDate), // >= startDate
                    [require('sequelize').Op.lte]: new Date(endDate),   // <= endDate
                },
            };
        }

        const events = await Event.findAll({
            where: whereClause, // Передаем объект с условиями в findAll
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении мероприятий', details: error.message });
    }
};

// Get a single event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'мероприятие не найден' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении мероприятия', details: error.message });
    }
};



// Update a event
const updateEvent = async (req, res) => {
    try {
        const [updated] = await Event.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ error: 'мероприятие не найден' });
        }
        const updatedEvent = await Event.findByPk(req.params.id);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при обновлении мероприятия', details: error.message });
    }
};



// Delete a event
const deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ error: 'мероприятие не найден' });
        }
        res.status(204).json(); // No content
    } catch (error) {
        res.status(400).json({ error: 'ошибка при удалении мероприятия', details: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
   // apiKeyMiddleware,
};



