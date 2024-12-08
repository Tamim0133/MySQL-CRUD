import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import Books from "./Books";
import Add from "./Add";
import Update from "./Update";
import "./style.css";

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

