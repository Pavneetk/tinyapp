function emailLookup(emailCheck, users) {
  for (const user in users) {
    for (const email in users[user]) {
      if (users[user][email] === emailCheck) {
        return users[user]['id'];
      }
    }
  }

  return false;

};

function filterURL(cookieUserID, urlDatabase){
  let filteredUrlData = {};
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
//math.random generates random number that is converted to base 36 (0-z), then set to a substring from index 2-6 to skip 0. 
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
};



module.exports = {
emailLookup,
filterURL,
generateRandomString,
};