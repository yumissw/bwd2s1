const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerConfig = require('./config/swaggerConfig');
// инициализация Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(morgan('dev')); // 'dev' - предустановленный формат для разработки
    // Другие форматы: 'combined', 'common', 'short', 'tiny'
// настройка Middleware
app.use(express.json()); // для обработки входящих JSON-запросов
app.use(cors()); // для разрешения запросов с других доменов
app.use(userRoutes); // Подключение маршрутов для пользователей
app.use(eventRoutes); // Подключение маршрутов для пользователей

// определение порта
const PORT = process.env.PORT || 3000; // получение из конфигурации или 3000

// для теста маршрут get
app.get('/', (req, res) => {
    res.json({ message: 'для теста' });
});

/*app.listen(PORT, (err) => {
    if (err) {
        console.error(`ошибка при запуске сервера: ${err.message}`);
        return;
    }
  console.log(`сервер запущен на порту: ${PORT}`);
});*/

// импорт и вызов функции для проверки подключения бд
const { authenticateDB } = require('./config/db.js');

const Event = require('./models/Event');
const User = require('./models/User');
const { associate } = require('./models/associations'); // Import associations
// Запуск сервера
app.listen(PORT, async (err) => {
    if (err) {
        console.error(`Ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`Сервер запущен на порту ${PORT}`);
    
    // Проверка соединения с базой данных
    await authenticateDB();
    await associate();
    // Синхронизация моделей
    await User.syncModel();
    await Event.syncModel();
    
    await associate();
});
