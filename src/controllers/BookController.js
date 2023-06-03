const books = []

function getBook(req, res) {
    const id = req.params.id;
    console.log("Id: ".concat(id))
};

module.exports = { getBook }
