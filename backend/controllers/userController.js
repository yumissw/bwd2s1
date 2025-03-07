const { User } = require('../models/User');
//const router = express.Router();
require('dotenv').config(); //новое
//const {apiKeyMiddleware} = require('../apikey/apikey')

// Создать нового пользователя
const createUser = async (req, res) => {

    const { name, email } = req.body;

    // проверка обязательных данных
    if (!name || !email) {
        return res.status(400).json({ message: 'не все обязательные поля указаны' });
    }
// Дополнительная проверка: имя не должно содержать цифры
const hasNumbers = /\d/.test(name);
if (hasNumbers) {
    return res.status(400).json({ message: 'Имя пользователя не должно содержать цифры' });
}
    try {

        // проверка уникальности email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'пользователь с таким email уже существует' });
        }

        const userData = req.body;
        const newUser = await User.create(userData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при создании пользователя', details: error.message });
    }
};


// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении пользователей', details: error.message });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении пользователя', details: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { name, email } = req.body;

    try {
          // проверка уникальности email
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
              return res.status(400).json({ message: 'пользователь с таким email уже существует' });
          }
    
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ error: 'пользователь не найден' });
        }
        const updatedUser = await User.findByPk(req.params.id);

        const hasNumbers = /\d/.test(name);
        if (hasNumbers) {
            return res.status(400).json({ message: 'Имя пользователя не должно содержать цифры' });
        }
      
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при обновлении пользователя', details: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ error: 'пользователь не найден' });
        }
        res.status(204).json(); // No content
    } catch (error) {
        res.status(400).json({ error: 'ошибка при удалении пользователя', details: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};



//module.exports = router;