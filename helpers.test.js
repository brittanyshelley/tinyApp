const assert = require('assert');
const urlsForUser = require('./helpers');

// Test case 1: User has URLs in the database
const urlDatabase = {
  "abc123": { longURL: "http://example.com", userID: "user1" },
  "def456": { longURL: "http://google.com", userID: "user2" },
  "ghi789": { longURL: "http://github.com", userID: "user1" }
};
const expectedOutput1 = {
  "abc123": { longURL: "http://example.com", userID: "user1" },
  "ghi789": { longURL: "http://github.com", userID: "user1" }
};
assert.deepStrictEqual(urlsForUser("user1", urlDatabase), expectedOutput1);

// Test case 2: User has no URLs in the database
const expectedOutput2 = {};
assert.deepStrictEqual(urlsForUser("user3", urlDatabase), expectedOutput2);

// Test case 3: Empty URL database
const emptyUrlDatabase = {};
const expectedOutput3 = {};
assert.deepStrictEqual(urlsForUser("user1", emptyUrlDatabase), expectedOutput3);

console.log("All test cases passed!");