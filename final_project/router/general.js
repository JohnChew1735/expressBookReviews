const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(404).json({message:"Username and password is incorrect"});
  }
  
  const userExists = users.find(user => user.username === username);
  if(userExists){
    return res.status(409).json({message:"Username already exists"});
  }
  else{
    users.push({username, password});
    return res.status(200).json({message:"User registered successfully"});
  }
});

public_users.get('/allBooks', (req, res) => {
  res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/',async (req, res) =>{
  //Write your code here
  try {
    const response = await axios.get("http://localhost:5000/allBooks");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const response = await axios.get("http://localhost:5000/allBooks");
    const booksData = response.data;

    const book = booksData[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
 });

// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
  //Write your code here
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get("http://localhost:5000/allBooks");
    const booksData = response.data;
    const booksByAuthor = Object.values(booksData).filter(
      book => book.author.toLowerCase() === author
    );

    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  //Write your code here
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get("http://localhost:5000/allBooks");
    const booksData = response.data;
    const booksByTitle = Object.values(booksData).filter(
      book => book.title.toLowerCase() === title
    );

    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if(books[isbn]){
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  else{
    res.status(404).json({message:"Book not found"});
  }
});

module.exports.general = public_users;
