
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController')
const tokenConfig = require('../authentication/TokenConfig')
const bookController = require('../controllers/BookController');

router.post('/login', loginController.login)
router.get('/books/:id', tokenConfig.verifyToken, bookController.getBook);


module.exports = router;