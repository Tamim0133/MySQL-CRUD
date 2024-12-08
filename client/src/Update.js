import axios from 'axios';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';  // Import Backdrop
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Add.css';

const Update = () => {
    const [bookId, setBookId] = useState("");
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: "",
        cover: null
    });
    const [alertMessage, setAlertMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false); // Backdrop visibility state

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initialBookId = location.pathname.split("/")[2];
        setBookId(initialBookId);
    }, [location]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get('http://localhost:8800/books/');
                console.log(res.data);
                res.data.forEach(book => {
                    if (book.id == bookId) {
                        setBook(book);
                    }
                });
            } catch (err) {
                console.error("Failed to fetch book data:", err);
            }
        };

        fetchBook();
    }, [bookId]);

    const handleBookIdChange = (e) => {
        setBookId(e.target.value);
    };

    const handleChange = (e) => {
        setBook((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setShowBackdrop(true); // Show backdrop

        setTimeout(async () => {
            setShowBackdrop(false); // Hide backdrop after 2 seconds

            let bookFound = false;
            try {
                const res = await axios.get('http://localhost:8800/books/');
                console.log(res.data);
                res.data.forEach(book => {
                    if (book.id == bookId) {
                        bookFound = true;
                    }
                });
            } catch (err) {
                console.error("Failed to fetch book data:", err);
            }

            if (bookFound) {
                try {
                    await axios.put(`http://localhost:8800/books/${bookId}`, book);

                    setAlertMessage("");
                    setTimeout(() => {
                        setSuccessMessage(`Book with ID ${bookId} was updated successfully!`);
                    }, 500);

                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate("/books");
                    }, 3000);

                } catch (err) {
                    console.error("Failed to update book:", err);
                }
            } else {
                setAlertMessage(`Book with ID ${bookId} not found!`);
            }
        }, 2000); // Delay the logic by 2 seconds
    };

    return (
        <div className='form'>
            <h1>Update Existing Book</h1>

            {/* Show alert if book is not found */}
            {alertMessage && <Alert severity="error">{alertMessage}</Alert>}

            {/* Show success message */}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            {/* Show loader/spinner if the page is loading */}
            {isLoading && <CircularProgress />}

            {/* Backdrop */}
            <Backdrop
                open={showBackdrop}
                style={{ zIndex: 1200, color: '#fff' }} // Adjust zIndex if needed
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <input
                type="text"
                placeholder='ID'
                name='id'
                value={bookId}
                onChange={handleBookIdChange}
            />
            <input
                type="text"
                placeholder='Title'
                name='title'
                value={book.title}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder='Description'
                name='desc'
                value={book.desc}
                onChange={handleChange}
            />
            <input
                type="number"
                placeholder='Price'
                name='price'
                value={book.price}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder='Cover URL'
                name='cover'
                value={book.cover || ''}
                onChange={handleChange}
            />
            <button onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;