/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация пользователей
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Регистрирует нового пользователя с указанными данными
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "регистрация успешна"
 *       400:
 *         description: Ошибка валидации или создания пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Серверная ошибка
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     description: >
 *       Проверяет email и пароль пользователя.
 *       При успешной аутентификации возвращает JWT-токен для доступа к защищенным роутам
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает JWT-токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Неверный email или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "неверный email или пароль"
 *                 details:
 *                   type: string
 *                   example: "Пользователь с таким email не найден"
 *       500:
 *         description: Серверная ошибка
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление JWT-токена (Access Token) с использованием Refresh Token
 *     description: >
 *       Получение нового Access Token при помощи Refresh Token.
 *       Позволяет пользователю получить новый Access Token без повторного ввода логина и пароля.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Успешное обновление токена, возвращает новый Access Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       400:
 *         description: Неверный запрос (отсутствует Refresh Token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh Token не предоставлен"
 *       401:
 *         description: Неверный Refresh Token или истек срок действия
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Неверный Refresh Token"
 *       500:
 *         description: Серверная ошибка
 */

/**
 * @swagger
 * /public/me:
 *   get:
 *     get:
 *     summary: Вывести пользователя
 *     description: Выводит определенного пользователя под указанным id
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Пользователь успешно выведен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка при выведении пользователя
 */