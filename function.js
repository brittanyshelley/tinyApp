function generateRandomString() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}



const findUserWithEmail = (email) => {
  for (const userId in userId) {
    if (users[user].email === email) {
      //We found our user
      return users[user];
    }
  }
  return null;
}

module.exports = { generateRandomString, findUserWithEmail };