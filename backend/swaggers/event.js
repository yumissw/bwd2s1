/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление событиями
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое событие
 *     description: Создает новое событие с указанными данными
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Событие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации или создания события
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Вывести все события
 *     description: Выводит все события в диапазоне дат
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: События успешно выведены
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка при выведении событий
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Вывести событие
 *     description: Выводит определенное событие с указанным id
 *     tags: [Events]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Событие успешно выведено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при выведении события
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить событие
 *     description: Обновляет событие под указанным id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Событие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при обновлении события
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить событие
 *     description: Удаляет событие под указанным id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       204:
 *         description: Событие успешно удалено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *
 *       400:
 *         description: Ошибка при удалении события
 */
