import React, {useState,useEffect} from 'react';
import axios from 'axios';

function App(){
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '' });

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost:3000/books');
        setBooks(res.data);
    };

    const addBook = async () => {
        if (!form.title || !form.author) return alert("Both fields are required");
        await axios.post('http://localhost:3000/books', form);
        setForm({ title: '', author: '' });
        fetchBooks();
    };

    const deleteBook = async (id) => {
        await axios.delete(`http://localhost:3000/books/${id}`);
        fetchBooks();
    };

      const updateBook = async (id) => {
            const newTitle = prompt("Enter new title:");
            const newAuthor = prompt("Enter new author:");
            if (newTitle && newAuthor) {
            await axios.put(`http://localhost:3000/books/${id}`, {
                title: newTitle,
                author: newAuthor
            });
            fetchBooks();
            }
        };

  useEffect(() => {
    fetchBooks();
  }, []);


return(
    <div>
        <h1>books</h1>
              <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />
      <button onClick={addBook}>Add Book</button>

      <ul>
        {books.map((book) =>(
            <li key = {book._id}>
                {book.title} by {book.author}
                <button onClick={() => updateBook(book._id)}>Update</button>
                <button onClick={() => deleteBook(book._id)}>Delete</button>
            </li>
        ))}
      </ul>
    </div>
);


}

export default App;