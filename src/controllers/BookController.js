const bookRepository = require("../repositories/BookRepository")

function registerBook(req, res) {
  const book = req.body;
  bookRepository.registerBook(book,
    () => {
      res.status(201).json(book);
    },
    (error) => {
      res.status(error.code).json(error);
    })
}

function getBooks(req, res) {
  bookRepository.getBooks(
    (books) => {
      res.json(books)
    }
  )
}

function getBook(req, res) {
  const isbn = req.params.id;
  bookRepository.getBook(isbn,
    (book) => {
      res.json(book);
    },
    (error) => {
      res.status(error.code).json(error);
    })
}

function locate(req, res) {
  const isbn = req.body.isbn;
  const userId = req.body.userId;
  bookRepository.locate(
    isbn,
    userId,
    (registration) => {
      res.status(201).json(registration);
    },
    (error) => {
      res.status(error.code).json(error);
    }
  )
}

function returnBookToLibrary(req, res) {
  const isbn = req.body.isbn;
  const userId = req.body.userId;
  bookRepository.returnBookToLibrary(
    isbn,
    userId,
    () => {
      res.json({ message: "Livro devolvido com sucesso! " });
    },
    (error) => {
      res.status(error.code).json(error);
    }
  )
}

module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };
