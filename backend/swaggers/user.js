//const {}=require('../routes/userRoutes');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /private/users:
 *   post:
 *     summary: Создать нового пользователя
 *     description: Создает нового пользователя с указанными данными
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации или создания пользователя
 */

/**
 * @swagger
 * /private/users:
 *   get:
 *     summary: Вывести всех пользователей
 *     description: Выводит всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Пользователи успешно выведены
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка при выведении пользователей
 */

/**
 * @swagger
 * /private/users/{id}:
 *   get:
 *     summary: Вывести пользователя
 *     description: Выводит определенного пользователя под указанным id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
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

/**
 * @swagger
 * /private/users/{id}:
 *   put:
 *     summary: Обновить пользователя
 *     description: Обновляет пользователя под указанным id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка при обновлении пользователя
 */

/**
 * @swagger
 * /private/users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     description: Удаляет пользователя под указанным id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка при удалении пользователя
 */
