import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert'; // Import Alert for messages
import './Add.css';

const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: ""
    });
    const [alertMessage, setAlertMessage] = useState(""); // State for error alert
    const [successMessage, setSuccessMessage] = useState(""); // State for success alert
    const navigate = useNavigate();

    const handleChange = (e) => {
        setBook((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        // Input validation
        if (!book.title || !book.desc || !book.price) {
            setAlertMessage("Please fill out all required fields (Title, Description, and Price).");
            return;
        }

        try {
            await axios.post("http://localhost:8800/books", book);

            // Show success message
            setAlertMessage(""); // Clear any previous error alert
            setSuccessMessage("Book added successfully!");

            // Hide success message after 2 seconds and navigate
            setTimeout(() => {
                setSuccessMessage(""); // Clear success message
                navigate("/books");
            }, 2000);
        } catch (err) {
            console.error("Error adding book:", err);
        }
    };

    return (
        <div className='form'>
            <h1>Add New Book</h1>

            {/* Display alert message if validation fails */}
            {alertMessage && <Alert severity="error">{alertMessage}</Alert>}

            {/* Display success message if book is added */}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <input
                type="text"
                placeholder='Title'
                onChange={handleChange}
                name='title'
                value={book.title}
            />
            <input
                type="text"
                placeholder='Description'
                onChange={handleChange}
                name='desc'
                value={book.desc}
            />
            <input
                type="number"
                placeholder='Price'
                onChange={handleChange}
                name='price'
                value={book.price || ''}
            />
            <input
                type="text"
                placeholder='Cover URL'
                onChange={handleChange}
                name='cover'
                value={book.cover}
            />
            <button onClick={handleClick}>Add</button>
        </div>
    );
};

export default Add;