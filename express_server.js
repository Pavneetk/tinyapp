const express = require("express");
const cookieSession = require('cookie-session');
const { emailLookup, filterURL, generateRandomString } = require('./helper');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {};
const users = {};


app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['kendrickLamar'],
  maxAge: 0.5 * 60 * 60 * 1000 //30mins, max time user will stay signed in
}));


app.set("view engine", "ejs"); // Set ejs as view engine



//Home Page
app.get("/", (req, res) => {
  //if the user is logged in redirect to the url page, else redirect to the login page
  if (users[req.session.user_id]) {
    res.redirect("/urls");

  } else {
    res.redirect("/login");
  }
});


//Add New Urls page
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_new", templateVars);

  } else {
    res.redirect("/login");
  }
});

//Urls index Page
app.get("/urls", (req, res) => {
  if (users[req.session.user_id]) {
    //returns filtered url database so user can only see their own urls 
    let filteredURLDatabase = filterURL(req.session.user_id, urlDatabase);
    
    const templateVars = { 
      urls: filteredURLDatabase, 
      user: users[req.session.user_id] 
    };

    res.render("urls_index", templateVars);

  } else {
    res.redirect("/login");
  }

});

//specifc short url page
app.get("/urls/:shortURL", (req, res) => {
  //if the encrypted cookie user_id exists in user database, the short url exists in the urldatabase, and the userID of the url in the url database matches the encrypted cookied user_id
  // then shows you the short url page
  if ((users[req.session.user_id]) && (urlDatabase[req.params.shortURL]) && (urlDatabase[req.params.shortURL]['userID'] === req.session.user_id)) {
    let filteredURLDatabase = filterURL(req.session.user_id, urlDatabase);
   
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: filteredURLDatabase[req.params.shortURL]['longURL'], 
      user: users[req.session.user_id], 
    };

    res.render("urls_show", templateVars);

  } else {
    res.sendStatus(403);
  }
});

//redirects short url to long url
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) { res.sendStatus(404); }

  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});

//retruns urlDatabase a json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//renders user registration page
app.get("/register", (req, res) => {
  if (users[req.session.user_id]) { res.redirect(`/urls`); }

  const templateVars = { user: users[req.session.user_id] };
  res.render("user_reg", templateVars);
});

//renders user login page
app.get("/login", (req, res) => {
  if (users[req.session.user_id]) { res.redirect(`/urls`); }

  const templateVars = { user: users[req.session.user_id] };
  res.render("user_login", templateVars);
});

//Creates new short url for entered long url and saves it to the urlDatabase
//calls generaterandomstring to create new short url. the shorturl and long url are added as key value pair
//then redirects to the new shorturl page
app.post("/urls", (req, res) => {
  
  let newShortURL = generateRandomString();
  
  urlDatabase[newShortURL] = {
    longURL: req.body['longURL'],
    userID: req.session.user_id
  };


  res.redirect(`/urls/${newShortURL}`);
});

//deletes shorturl and longurl key value pair from the urlDatabase object
//and redirects back to the url index page
app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id]) {
    let urlToDelete = req.params['shortURL'];
    delete urlDatabase[urlToDelete];

    res.redirect(`/urls`);

  } else {
    res.sendStatus(403);
  }
});

//edits long url from short url and then redirects you back to its short url page
app.post("/urls/:shortURL/edit", (req, res) => {
  if (users[req.session.user_id]) {
    let newEditURL = req.body.newEditURL;
    urlDatabase[req.params['shortURL']]['longURL'] = newEditURL;

    res.redirect(`/urls/${req.params['shortURL']}`);

  } else {
    res.sendStatus(403);
  }
});

//Creates a login cookie
app.post("/login", (req, res) => {
  //first checks if the entered email exisits and the entered password matches the emails hashed password
  //if the email doesn't exist the if will short circuit and skip then next condition
  if ((emailLookup(req.body.email, users) !== false) && (bcrypt.compareSync(req.body.password, users[emailLookup(req.body.email, users)]['password']))) {
    req.session.user_id = users[emailLookup(req.body.email, users)]['id'];

    res.redirect("/urls");

  } else {
    res.sendStatus(401);
  }


});

//logs out user
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

//registers a new user
app.post("/register", (req, res) => {

  const newId = generateRandomString();
  //if both fields have a value and the email lookup returns false, then create a new user object and add it to the users database
  if ((req.body.email) && (req.body.password) && (!emailLookup(req.body.email, users))) {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);//creates a hashed password before storing in database
    
    let newUser = {
      id: newId,
      email: req.body.email,
      password: hashedPassword,
    };

    //set users database key and encrypted cookie to newuser id
    users[newUser['id']] = newUser;
    req.session.user_id = newUser['id'];

    res.redirect(`/urls`);

  } else {

    res.sendStatus(400);
  }

});


//message indicated server is running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



