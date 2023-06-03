const books = []

function getBook(req, res) {
    const id = req.params.id;
    console.log(id)
};

module.exports = { getBook }
