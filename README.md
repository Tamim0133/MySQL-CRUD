
# MySQL-CRUD

Used mySql as a backend and did basic CRUD operation.

### 01. Created Backend Schema
created Schema for the project. 
used mySql workbench rather than direct sql

### 02. Created Test (Backend , Client) folder
Seperate Backend and Frontend folders

### 03. Initialize backend 
    npm i -y
Package.json file create hobe
    
    npm i express mysql2 nodemon 

Then ->
    
    "type" : "module" 
Package.json er vitore main er niche  set kora lagbe

    "start" : "nodemon index.js"
Script er vitore giye eita kora lagbe 


### 04. Create an express app : index.js 

    import express from "express"

    const app = express()

    app.listen(8800, () => {
        console.log("Connected to backend !")
    })

Run it - 

    npm start 

eita run korle -> nodemon index.js e run hobe. Taile ektu pore pore refresh kora lagbe na. Save krle automatic fresh hoye jabe.

### 05. Connect to MySQL Databse : 

    import mysql from "mysql2";

    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "amidhabian",
        database: "test"
    })

    app.get("/", (req, res) => {
        res.json("Hello this is the backend")
    })

Now, go to -> 

    localhost:8800/

This is how we are making api request using an express server.

### 06. Show all books :
    app.get("/books", (req, res) => {
        const q = "SELECT * from books";
        db.query(q, (err, data) => {
            if (err) return res.json(err)
            return res.json(data);
        });
    })

GO to : 
    localhost:8800/books/

There might be an authentication problem , use (MAC M1) :

    ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'amidhabian'

### 07. Similarly the other operations 

// Create

    app.post("/books", (req, res) => {
        const q = "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES (?)";
        const values = [
            req.body.title,
            req.body.desc,
            req.body.cover,
            req.body.price
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json("Book has been created");
        });
    });


// Delete

    app.delete("/books/:id", (req, res) => {
        const bookId = req.params.id;
        const q = "DELETE FROM books where id = ?";

        db.query(q, [bookId], (err, data) => {
            if (err) return res.json(err);
            return res.json("Book has Deleted Successfully");
        })
    })

// Update

    app.put("/books/:id", (req, res) => {
        const bookId = req.params.id;
        const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";

        const values = [
            req.body.title,
            req.body.desc,
            req.body.price,
            req.body.cover,
        ];

        db.query(q, [...values, bookId], (err, data) => {
            if (err) return res.json(err);
            return res.json("Book has been updated successfully.");
        });
    })



### 08. To send and receive 

    app.use(express.json());
    app.use(cors());


# <<< Frontend >>>
 ### 01. Initialize
    cd client 
    npx create-react-app .
    npm i react-router-dom
    npm start

### 02. App.js
- App er duita part e single page rakha ekta uporer navbar ar nicher content gula route akare ache 


        const App = () => {
            return (
                <Router> 
                    <div className="App">
                        <NavBar />
                        <MainContent />
                    </div>
                </Router>
            );
        };

- Navbar : Upore stick korbe

        const NavBar = () => {
            return (
                <div>
                    <nav >
                        <ul>
                            <li><Link to="/books">Books</Link></li>
                            <li><Link to="/add">Add Book</Link></li>
                            <li><Link to="/update/0">Update Book</Link></li>
                        </ul>
                    </nav>
                </div>
            );
        };

- MainContent e Rotute gula thakbe. Je element gula thake oi name er seperate page thake . 

        const MainContent = () => {
            return (
                <div>
                    <Routes>
                        <Route path="/books" element={<Books />} />
                        <Route path="/add" element={<Add />} />
                        <Route path="/update/:id" element={<Update />} />
                    </Routes>
                </div>
            );
        };

        export default App;

Update page e thokhon e jabe jodi Dynamic Routing use kora hoy . That is   `/update/:id`

 
 
 ### 03 : Books Page

        npm i axios

- Fetch books 
    
        const [books, setBooks] = useState([]);

        useEffect(() => {
            const fetchAllBooks = async () => {
                try {
                    const res = await axios.get("http://localhost:8800/books");
                    console.log(res);
                    setBooks(res.data); 
                } catch (err) {
                    console.log(err);
                }
            };
            fetchAllBooks();
        }, []);


- Show all books : 

        return (
        <div>
            <h2>Books List</h2>
            <p>Here you can view the list of books.</p>
            <div>
                {books.map((book) => (
                    <div key={book.id}>
                        {book.cover && <img src={book.cover} alt='Book Cover' />}
                        <h2>{book.title}</h2>
                        <p>{book.desc}</p>
                        <span>${book.price}</span>
                        <div>
                            <button onClick={() => handleDelete(book.id)}>Delete</button>
                        </div>
                        <div>
                            <Link to={`/update/${book.id}`}>
                                <button>Update</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

- Amar kache books er ekta array ache . Oikhan theke map kore prottekta individual book ber korsi.
- book.cover jodi empty na hoy tahole image tag e oi book er image show krtesi
- delete button e click krle ekta function call hobe
- update button e click krle Update page e chole jabe with book id

Book remove korar jonne : 

    const handleDelete = async (id) => {
            try {
                await axios.delete(`http://localhost:8800/books/${id}`);
                setBooks(books.filter(book => book.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
•	The axios.delete call sends a DELETE request to the backend API endpoint (http://localhost:8800/books/${id}).

•	On the backend, if this endpoint is correctly implemented to handle DELETE requests and delete the book with the given id, the book will be removed from your backend database or storage.

•	After the backend confirms the deletion (the request is successful), the setBooks function updates your frontend state to remove the deleted book from the UI. oijonne await deya



### 04. Add page
-Ekta form banaisi jeikhan theke new book add krbo

    return (
        <div className='form'>
            <h1>Add New Book</h1>
            <input type="text" placeholder='Title' onChange={handleChange} name='title' />
            <input type="text" placeholder='Description' onChange={handleChange} name='desc' />
            <input type="number" placeholder='Price' onChange={handleChange} name='price' />
            <input type="text" placeholder='Cover URL' onChange={handleChange} name='cover' />
            <button onClick={handleClick}>Add</button>
        </div>
    );

-New j book add korbo oita store korar jonne ekta book state banaisi 

#### Input field e name jeita dibo same  name gula use kora lagbe
        const [book, setBook] = useState({
                title: "",
                desc: "",
                price: null,
                cover: ""
            });



- handleChange ekta interesting function. Eita :
`Updates the book state whenever an input field changes`


    const handleChange = (e) => {
        setBook((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

•	Uses e.target.name (name of the input field) as the key.

•	Uses e.target.value (current value of the input field) as the value.

•	...prev ensures the rest of the state (book) remains unchanged.

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8800/books", book);
            navigate("/books");
        } catch (err) {
            console.log(err);
        }
    };

i)	e.preventDefault():
 Prevents the default form submission behavior and prevents page reload.

ii)	axios.post:

•	Sends a POST request to http://localhost:8800/books with the book object as the payload.

        await axios.post("http://localhost:8800/books", book);

•	Adds the new book to the backend (assuming the backend is properly set up to handle this request).
    

iii) 	navigate("/books"):

•	Redirects the user to the /books page after successfully adding the book.




### 05 . Update Page 
Eipage e normally ashle kichu hobe na 
Ami jokhon kuno ekta book e click kore ashbo then oi book er id upore location e show krbe

Tarpore add korar time e jei kaaj ta krsi oita krbo .

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8800/books/${bookId}`, book); navigate("/books");
        } catch (err) {
            console.log(err);
        }
    };

- Handle click e `put` use krbo
ar bookID thakbe location theke nibo :

        const navigate = useNavigate();
        const location = useLocation();
        const bookId = location.pathname.split("/")[2];