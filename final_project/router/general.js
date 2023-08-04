const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) =>{
    let usersWithsamename = users.filter((user)=>{
        return user.username === username;
    });
    if(usersWithsamename > 0){
        return true;
    }else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  //console.log(`username: ${username}, password: ${password}`);
  console.log('users in register is:'+ users);
  if(username && password){
      console.log(`username 1 : ${username}, password: ${password}`);
    if(!doesExist(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"})
    }else{
        return res.status(404).json({message: "Customer already exists!"})
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks;
  for(var i in books){
    if(books[i].author === author){
        var arr = [{"isbn": i, "title": books[i].title, "reviews": books[i].reviews}];
        filteredBooks = {"booksByAuthor": arr};
    }
  }
  return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filteredBooks;
    for(var i in books){
      if(books[i].title === title){
          var arr = [{"isbn": i, "author": books[i].author, "reviews": books[i].reviews}];
          filteredBooks = {"booksByTitle": arr};
      }
    }
    console.log(JSON.stringify(filteredBooks, null, 4));
    return res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
