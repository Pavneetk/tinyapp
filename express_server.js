const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//const morgan = require('morgan'); // let express know to use middlewaree
//app.use(morgan('dev'));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // Set ejs as view engine

//function implemented from https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
//math.random generates random number that is converted to base 36 (0-z), then set to a substring from index 2-6 to skip 0. 
function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
};



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Home Page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Hello Page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Add New Urls page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Urls index Page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//specifc short url page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

//redirects short url to long url
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//retruns urlDatabase a json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Creates new short url for entered long url and saves it to the urlDatabase
//calls generaterandomstring to create new short url. the shorturl and long url are added as key value pair 
//then redirects to the new shorturl page
app.post("/urls", (req, res) => {
  console.log(req.body);
  let newShortURL =generateRandomString();
  urlDatabase[newShortURL] = req.body['longURL']; 
  res.redirect(`/urls/${newShortURL}`);         
});

//deletes shorturl and longurl key value pair from the urlDatabase object
//and redirects back to the url index page
app.post("/urls/:shortURL/delete", (req, res) => {
  let urlToDelete = req.params['shortURL'];
  delete urlDatabase[urlToDelete];
  res.redirect(`/urls`);         
});

//message indicated server is running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});