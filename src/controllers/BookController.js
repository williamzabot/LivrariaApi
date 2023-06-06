const registerController = require("../controllers/RegisterController");

let registerCount = 0;
let isbn = 0;
const books = [];

function registerBook(req, res) {
  const book = req.body;
  if (book && book.title && book.price && book.authors) {
    book.available = true;
    book.isbn = isbn += 1;
    if (!book.publisher) {
      book.publisher = "";
    }
    books.push(book);
    res.status(201).json(book);
  } else {
    res.status(400).json({ message: "Faltam informações sobre o livro" });
  }
}

function getBooks(req, res) {
  res.json(books);
}

function getBook(req, res) {
  const isbn = req.params.id;
  let bookExists = false;
  books.forEach((book) => {
    if (book.isbn == isbn) {
      bookExists = true;
      res.json(book);
    }
  });
  if (!bookExists) {
    res.status(400).json({ message: "Livro não encontrado" });
  }
}

function locate(req, res) {
  let user = {};
  let userExists = false;
  const isbn = req.body.isbn;
  const userId = req.body.userId;
  if (userId && isbn) {
    registerController.getCustomers().forEach((customer) => {
      if (customer.customerId == userId) {
        userExists = true;
        user = customer;
      }
    });
    if (userExists) {
      let bookLocate = {};
      let bookExists = false;
      books.forEach((book) => {
        if (book.isbn == isbn) {
          bookExists = true;
          bookLocate = book;
        }
      });
      if (bookExists) {
        const date = getDate();
        const leasedBooks = user.leasedBooks;
        const id = (registerCount += 1);
        bookLocate.available = false;
        if (leasedBooks < 3) {
          const registration = {
            registrationId: id,
            date: date,
            book: bookLocate,
            customer: user,
          };
          leasedBooks.push(bookLocate);
          res.status(201).json(registration);
        }
      } else {
        res.status(400).json({ message: "Livro não encontrado" });
      }
    } else {
      res.status(400).json({ message: "Cliente não encontrado" });
    }
  } else {
    res.status(400).json({ message: "Faltam informações sobre a locação" });
  }
}

function returnBookToLibrary(req, res) {
  let bookExists = false;
  const isbn = req.body.isbn;
  const userId = req.body.userId;
  if (userId && isbn) {
    registerController.getCustomers().forEach((customer) => {
      if (customer.customerId == userId) {
        const leasedBooks = customer.leasedBooks;
        for (let i = 0; i < leasedBooks.length; i++) {
          const leasedBook = leasedBooks[i];
          if (leasedBook.isbn == isbn) {
            bookExists = true;
            leasedBooks.splice(i, 1);
            leasedBook.available = true;
            res.json({ message: "Livro devolvido com sucesso! " });
          }
        }
      }
    });
    if (!bookExists) {
      res.status(400).json({ message: "Livro não encontrado" });
    }
  } else {
    res.status(400).json({ message: "Informações inválidas" });
  }
}

function getDate() {
  const date = new Date();
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };
