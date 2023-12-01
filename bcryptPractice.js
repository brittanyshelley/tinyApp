const bcrypt = require('bcryptjs');

const plainTextPassword = "purple-monkey-dinosaur";

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);



bcrypt.hash(plainTextPassword, salt) => {
  console.log(hash);
}

const storedHash = "$2a$

const result = bcrypt.compareSync(plainTextPassword, storedHash);

console.log('result:', result);

// app.use(cookieSession({
//   name: 'cookie',
//   keys: [/* secret keys */],
// //cookie options
// maxAge: 24 * 60 * 60 * 1000 //24 hours
// }));