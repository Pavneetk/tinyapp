const { assert } = require('chai');

const {emailLookup, filterURL} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testurlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "example2"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "example2"},
  "9sm3xK": {longURL: "http://www.google.com", userID: "example1"},
  "9sm2xK": {longURL: "http://www.google.com", userID: "example3"},
  "9s15xK": {longURL: "http://www.google.com", userID: "example3"},
};

describe('emailLookup', function() {
  it('Should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('Should return false with invalid email', function() {
    const user = emailLookup("user33@example.com", testUsers)
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

describe('filterURL', function() {
  it('Should return an object with filterd urls', function() {
    const user = Object.keys(filterURL("example2", testurlDatabase));
    const expectedOutput = ["b2xVn2","9sm5xK"];
    assert.deepEqual(user, expectedOutput);
  });
 
});