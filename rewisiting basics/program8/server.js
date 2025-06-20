const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const bookSchema = new mongoose.Schema({
    title: String,
    author: String
});

mongoose.connect(process.env.MONGODB_URI, {})
.then(()=>{console.log("Connected to MongoDB")})

const Book = mongoose.model('Book', bookSchema);

app.get('/books', async (req, res) =>{
    const books = await Book.find();
    res.json(books);
});

app.post('/books', async (req,res)=>{
    const book = new Book(req.body);
    res.json(await book.save());
})

app.put('/books/:id',  async (req, res)=>{
    const books = await Book.find();
    const updateBook = await  books.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updateBook);
})

app.delete('/books/:id', async (req, res) =>{
    const book = await Book.findOne(req.params.id);
    res.json(book);
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

