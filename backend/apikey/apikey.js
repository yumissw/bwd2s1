const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // API-ключ передается в заголовке 'x-api-key'
    const expectedApiKey = process.env.API_KEY; // Получаем API-ключ из .env

    if (!apiKey) {
        return res.status(401).json({ message: 'API-ключ отсутствует' });
    }

    if (apiKey !== expectedApiKey) {
        return res.status(403).json({ message: 'Неверный API-ключ' });
    }

    next(); // Если API-ключ валиден, передаем управление следующему middleware или обработчику
};

module.exports = {
    apiKeyMiddleware,
};