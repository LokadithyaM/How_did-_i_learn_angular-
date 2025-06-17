const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }
];

let currentId = 4;

app.get('/books', (req,res)=>{
    res.json(books);
});

app.get('/books/:id', (req, res)=>{
    const book = books.find(book => book.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('book not found');
    res.json(book);
})

app.post('/books', (req,res)=>{
    const {title, author} = req.body;
    if(!title || !author) return res.status(404).send('title and auther are required');
    const newBook = {
        id: currentId++,
        title,
        author
    }
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req,res)=>{
    const book = books.find(book => book.id === parseInt(req.params.id));
    if(!book) return res.status(404).send('book not found');
    const { title, author} = req.body;
    if(title) book.title = title;
    if(author) book.author = author;

    res.json(book);
});

app.delete('/books/:id', (req,res)=>{
    const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
    if(bookIndex === -1) return res.status(404).send('book not found');
    books.splice(bookIndex,1);
    res.status(204).send();
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});