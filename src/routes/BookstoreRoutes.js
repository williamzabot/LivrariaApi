
const express = require('express')
const router = express.Router()

const registerController = require('../controllers/RegisterController')
const loginController = require('../controllers/LoginController')
const tokenConfig = require('../authentication/TokenConfig')
const bookController = require('../controllers/BookController')

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/books/:id', tokenConfig.verifyToken, bookController.getBook)
router.post('/books', tokenConfig.verifyToken, bookController.registerBook)

module.exports = router;