//Loops through each users email and checks if it makes the current users email
//if an id is found it is returned, if a matching one is not found it returns false
const emailLookup = function(emailCheck, users) {
  for (const user in users) {
    for (const email in users[user]) {
      if (users[user][email] === emailCheck) {
        return users[user]['id'];
      }
    }
  }

  return false;

};


//Returns filterd Urldatabase object with urls that correspond to the user
const filterURL = function(cookieUserID, urlDatabase) {
  let filteredUrlData = {};

  //Loops through the short urls and then the userid in those objects, then checks if it matches the current user
  //once a matched userid is found a new key with the shorturl and value with the long url and userid is made and added to the filtered URL database object
  for (const shorturls in urlDatabase) {
    for (const userID in urlDatabase[shorturls]) {
      if (urlDatabase[shorturls][userID] === cookieUserID) {
        filteredUrlData[shorturls] = {
          longURL: urlDatabase[shorturls]['longURL'],
          userID: urlDatabase[shorturls][userID],
        };
      }
    }
  }
  return filteredUrlData;
};


//function implemented from https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
//math.random generates random number that is converted to base 36 (0-z), then set to a substring from index 2-6 that skips the first "0." and returns the next 6 digits
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};



module.exports = {
  emailLookup,
  filterURL,
  generateRandomString,
};