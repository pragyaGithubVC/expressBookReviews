const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    console.log('users is: '+ users);
    let validUsers = users.filter((user)=> {
        return (user.username === username && user.password === password);
    });
    if(validUsers.length > 0){
        return true;
    }else{ 
        return false; 
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(`username 2: ${username}, password: ${password}`);
  if(!username || ! password){
      return res.status(404).json({message: "Error logging in"});
  }
  if(authenticatedUser(username,password)){
      let accessToken = jwt.sign(
        {data: password}, 
        'access',
        {expiresIn: 60 * 60}
       );
     req.session.authorization = {
         accessToken,username
     }
     return res.status(200).send("Customer successfully logged in");
  }else{
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];
    var bookToUpdateReviewIn = books[isbn];
    console.log('username is: '+ username);
    bookToUpdateReviewIn.reviews[username] = review;
    //console.log('bookToUpdateReviewIn : ' +JSON.stringify(bookToUpdateReviewIn, null, 4));
    return res.status(200).send(`The review for the book with isbn ${isbn} has been added/updated`);
  });
  
//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    const book = books[isbn];
    console.log('book : ' +JSON.stringify(book, null, 4));
    if(book.reviews[username]){
        delete book.reviews[username];
    }
    return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
