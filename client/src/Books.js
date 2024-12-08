import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Books.css'; // Ensure to import the CSS file  
import { Link } from 'react-router-dom';

function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/books");
                console.log(res);
                setBooks(res.data); // Store books data  
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/books/${id}`);
            setBooks(books.filter(book => book.id !== id));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="books-container">
            <h2 style={{ textAlign: 'center' }}>Books List</h2>
            <p style={{ margin: 'auto', textAlign: 'center' }}>Here you can view the list of books.</p>
            <div className='books'>
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={book.cover} alt='Book Cover' />}
                        <h2>{book.title}</h2>
                        <p><span>id # {book.id}</span></p>
                        <p>{book.desc}</p>
                        <span className='price'>${book.price}</span>
                        <div className='button-container'>
                            <button className='delete' onClick={() => handleDelete(book.id)}>Delete</button>
                        </div>
                        <div className="button-container">
                            <Link to={`/update/${book.id}`} className="update-link">
                                <button className="update">Update</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Books;