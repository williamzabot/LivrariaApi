const registerRepository = require("../repositories/RegisterRepository")
const databaseClient = require("../database/DatabaseClient")

const books = [];
let isbnCount = 0;
let registerCount = 0;

function registerBook(book, onSuccess, onFailure) {
    if (book && book.title && book.price && book.authors) {
        book.available = true;
        book.isbn = isbnCount += 1;
        if (!book.publisher) {
            book.publisher = "";
        }
        books.push(book);
        onSuccess()
    } else {
        onFailure({ code: 400, message: "Faltam informações sobre o livro" })
    }
}

function getBooks(showBooks) {
    showBooks(books)
}

function getBook(isbn, onSuccess, onFailure) {
    let bookExists = false;
    books.forEach((book) => {
        if (book.isbn == isbn) {
            bookExists = true;
            onSuccess(book)
        }
    });
    if (!bookExists) {
        onFailure({ code: 404, message: "Livro não encontrado" })
    }
}

function locate(isbn, userId, onSuccess, onFailure) {
    let user = {};
    let userExists = false;
    if (userId && isbn) {
        registerRepository.getCustomers().forEach((customer) => {
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
                if (leasedBooks.length < 3) {
                    const registration = {
                        registrationId: id,
                        date: date,
                        book: bookLocate,
                        customer: user,
                    };
                    leasedBooks.push(bookLocate);
                    onSuccess(registration)
                }
            } else {
                onFailure({ code: 404, message: "Livro não encontrado" })
            }
        } else {
            onFailure({ code: 404, message: "Cliente não encontrado" })
        }
    } else {
        onFailure({ code: 400, message: "Faltam informações sobre a locação" })
    }
}

function returnBookToLibrary(isbn, userId, onSuccess, onFailure) {
    let bookExists = false;
    if (userId && isbn) {
        registerRepository.getCustomers().forEach((customer) => {
            if (customer.customerId == userId) {
                const leasedBooks = customer.leasedBooks;
                for (let i = 0; i < leasedBooks.length; i++) {
                    const leasedBook = leasedBooks[i];
                    if (leasedBook.isbn == isbn) {
                        bookExists = true;
                        leasedBooks.splice(i, 1);
                        leasedBook.available = true;
                        onSuccess()
                    }
                }
            }
        });
        if (!bookExists) {
            onFailure({ code: 404, message: "Livro não encontrado" })
        }
    } else {
        onFailure({ code: 400, message: "Informações inválidas" })
    }
}


function getDate() {
    const date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };