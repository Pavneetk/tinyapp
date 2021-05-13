const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
//const morgan = require('morgan'); // let express know to use middlewaree
//app.use(morgan('dev'));
const bodyParser = require("body-parser");
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "example1"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "example2"}
};



const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "welcome"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "hello"
  }
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs"); // Set ejs as view engine

//function implemented from https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
//math.random generates random number that is converted to base 36 (0-z), then set to a substring from index 2-6 to skip 0. 
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
};

function emailLookup(emailCheck) {
  for (const user in users) {
    for (const email in users[user]) {
      if (users[user][email] === emailCheck) {
        return users[user]['id'];
      }
    }
  }

  return false;

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
  if (users[req.cookies['user_id']]){
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
  }
  else {
    res.redirect("/login");
  }
});

//Urls index Page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };

  res.render("urls_index", templateVars);

});

//specifc short url page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user: users[req.cookies['user_id']], };
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

//renders user registration page
app.get("/register", (req, res) => {

  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("user_reg", templateVars);
});

//renders user login page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("user_login", templateVars);
});

//Creates new short url for entered long url and saves it to the urlDatabase
//calls generaterandomstring to create new short url. the shorturl and long url are added as key value pair 
//then redirects to the new shorturl page
app.post("/urls", (req, res) => {
  console.log(req.body);
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL :req.body['longURL'],
    userID: req.cookies['user_id']
  };
  
  
  res.redirect(`/urls/${newShortURL}`);
});

//deletes shorturl and longurl key value pair from the urlDatabase object
//and redirects back to the url index page
app.post("/urls/:shortURL/delete", (req, res) => {
  let urlToDelete = req.params['shortURL'];
  delete urlDatabase[urlToDelete];
  res.redirect(`/urls`);
});

//edits long url from short url and then redirects you back to its short url page
app.post("/urls/:shortURL/edit", (req, res) => {
  let newEditURL = req.body.newEditURL;
  urlDatabase[req.params['shortURL']] = newEditURL;
  res.redirect(`/urls/${req.params['shortURL']}`);
});

//Creates a login cookie
app.post("/login", (req, res) => {
  if((emailLookup(req.body.email) !== false) && (users[emailLookup(req.body.email)]['password'] === req.body.password)) {
    res.cookie('user_id', users[emailLookup(req.body.email)]['id'] )
    res.redirect("/urls");
  }
  else{
  res.sendStatus(403);
  }


});

//logs out user
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

//registers a new user
app.post("/register", (req, res) => {

  const newId = generateRandomString();

  if ((req.body.email) && (req.body.password) && (!emailLookup(req.body.email))) {
    
    let newUser = {
      id: newId,
      email: req.body.email,
      password: req.body.password,
    }

    users[newUser['id']] = newUser;
    res.cookie('user_id', newUser['id']);
    res.redirect(`/urls`);
  } else {

  res.sendStatus(400);
  }

});


//message indicated server is running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});