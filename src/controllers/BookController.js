const bookRepository = require("../repositories/BookRepository")

function registerBook(req, res) {
  const book = req.body;
  bookRepository.registerBook(book,
    () => {
      res.status(201).json(book);
    },
    () => {
      res.status(400).json({ message: "Faltam informações sobre o livro" });
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
    }, () => {
      res.status(400).json({ message: "Livro não encontrado" });
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
    () => {
      res.status(404).json({ message: "Livro não encontrado" });
    },
    () => {
      res.status(404).json({ message: "Cliente não encontrado" });
    },
    () => {
      res.status(400).json({ message: "Faltam informações sobre a locação" });
    },
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
    () => {
      res.status(400).json({ message: "Livro não encontrado" });
    },
    () => {
      res.status(400).json({ message: "Informações inválidas" });
    }
  )
}


module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };
