function generateRandomString() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}


const users = require('./express_server.js');

const getUserByEmail = (email, users) => {
  // loop through the users object
  for (let key of Object.keys(users)) {
    if (users[key]["email"] === email) {
      // we found our user!
      return users[key];
    }
  }
  return false;
};

const checkIfAlreadyRegistered = (email, users) => {
  // loop through the users object
  for (let key of Object.keys(users)) {
    if (users[key]["email"] === email) {
      // we found our user!
      return true;
    }
  }
  return false;
}

const getUserById = (id, users) => {
  // loop through the users object
  for (let key of Object.keys(users)) {
    if (users[key]["id"] === id) {
      // we found our user!
      return users[key];
    }
  }
  return false;
};

module.exports = { generateRandomString, getUserByEmail, checkIfAlreadyRegistered, getUserById };