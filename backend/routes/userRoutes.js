const express = require('express');
const router = express.Router();

const {apiKeyMiddleware} = require('../apikey/apikey')

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');



router.post('/users', apiKeyMiddleware, createUser); 
router.get('/users', apiKeyMiddleware, getUsers);   
router.get('/users/:id', apiKeyMiddleware, getUserById); 
router.put('/users/:id', apiKeyMiddleware, updateUser); 
router.delete('/users/:id', apiKeyMiddleware, deleteUser);


// без апи кей
/*router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);*/
module.exports = router;