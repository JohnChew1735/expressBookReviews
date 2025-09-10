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

function fetchBooks(){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(books);
    }, 500);
  });
}

// Get the book list available in the shop
public_users.get('/',async (req, res) =>{
  //Write your code here
  try{
    const data = await fetchBooks();
    return res.status(200).send(JSON.stringify(data, null, 4));
  }
  catch(error){
    return res.status(500).json({message:"Error fetching books", error:error.message});
  }
});

function fetchBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 500);
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const data = await fetchBookByIsbn(isbn);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
 });

function fetchBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found for this author"));
      }
    }, 500);
  });
}
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
  //Write your code here
  try{
    const author = req.params.author;
    const data = await fetchBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(data, null, 4));
  }
  catch(error){
    return res.status(404).json({message:error.message});
  }
});

function fetchBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookByTitle = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      );

      if (bookByTitle.length > 0) {
        resolve(bookByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 500);
  });
}

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  //Write your code here
  try {
    const title = req.params.title;
    const data = await fetchBookByTitle(title);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
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
