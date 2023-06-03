
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/BookController');
router.get('/books/:id', bookController.getBook);
module.exports = router;