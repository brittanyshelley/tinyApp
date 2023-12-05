const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');


const { generateRandomString, getUserByEmail, checkIfAlreadyRegistered, getUserById, urlsForUser } = require("./function");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


//Middleware
app.use((req, res, next) => {
  // console.log(`ROUTE: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cookieSession({
   name: 'session',
   keys: ['cookieKey'],
}));

// GET login
app.get("/login", (req, res) => {
  const loggedInUser = req.session.user_id;//Get the user_id from the session
    if (loggedInUser) {
      return res.redirect('/urls');
    }
    const templateVars = { user: null };
  res.render("urls_login", templateVars);
});

//POST /login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // did they NOT give us an email or password
  if (!email || !password) {
    return res.status(403).send('please provide an email AND password');
  }
  // lookup the user based on their email
  const foundUser = getUserByEmail(email, users);
  // did we NOT find a user
  if (!foundUser) {
    return res.status(403).send('no user with that email found');
  }
  // do the passwords NOT match
  const result = bcrypt.compareSync(password, foundUser.password);
  //if (foundUser.password !== password) {
  if (!result) {
    return res.status(403).send('passwords do not match');
  }
  req.session.user_id = foundUser.id;
  res.redirect('/urls');
});

//Logout, clear username cookie and redirect to /urls
app.post('/logout', (req, res) => {
  req.session.user_id = null; // clear all cookies
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  const loggedInUser = req.session.user_id;//Get the user_id from the session
    if (loggedInUser) {
      return res.redirect('/urls');
    }
  const templateVars = { user: null };
  res.render('urls_register', templateVars);
});

// Handle the registration logic here
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  // did they NOT give us an email or password
  if (!email || !password) {
    return res.status(400).send('please provide an email AND password');
  }
  // check if the provided email address is unique
  const foundUser = checkIfAlreadyRegistered(email, users);
  // did we find a user
  if (foundUser) {
    return res.status(400).send('a user with that email already exists');
  }
  const id = generateRandomString();
  // generate the hash
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = {
    id: id,
    email: email,
    password: hash,
  };
  users[id] = user; // Update the users object with the new user
  req.session.user_id = id; // Setting the cookie here
  console.log('users:', users);
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const loggedInUser = req.session.user_id;
  const templateVars = { urls: urlDatabase,
    user: users[loggedInUser] };//Passing user object to templateVars
  return res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const loggedInUser = req.session.user_id;
  // console.log('loggedInUsure:', loggedInUser);
  if (!loggedInUser) {
    return res.redirect('/login');
  }
  const templateVars = { urls: urlDatabase,
    user: users[loggedInUser] };//Passing user object to templateVars
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Retrieve the long URL from urlDatabase
  const templateVars = { id: id, longURL: longURL, user: users[req.session.user_id] };//equal to line 107
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});

//Update's url from database when button pushed
app.post('/urls/:id', (req, res) => {
  // console.log(req.session.user_id, '***');
  const id = req.params.id;
  const newLongURL = req.body.newLongURL;
  urlDatabase[id] = newLongURL
  res.redirect('/urls');
});

//Delete's url from database when button pushed
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Redirects to the longURL page
app.get("/u/:id", (req, res) => {
  if (urlDatabase[req.params.id]) {
    const longURL = urlDatabase[req.params.id];
    res.redirect(longURL);
  } else {
    res.status(404).send("<h2>URL not found</h2>");
  }
});

app.post("/urls", (req, res) => {
  const loggedInUser = req.session.user_id;
  if (!loggedInUser) {
    return res.status(401).send('you must be signed in to use this page');
  }
  const newLongURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = newLongURL;
  res.redirect(`/urls/${id}`);
  // console.log('TESTING')
  // console.log(req.body.longURL); // Log the POST request body to the console

});

app.get("/", (req, res) => {
  res.send("Hello!");
});
//added page to display urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  // console.log(`Example app listening on port ${PORT}!`);
});

// const express = require("express");
// const app = express();
// const PORT = 8080; // default port 8080

// app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// //Displays urls database object at localhost:8080/urls.json
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase };
//   res.render("urls_index", templateVars);
// });

// app.get("/urls/:id", (req, res) => {
//   const templateVars = { id: req.params.id, longURL: req.params.longUrl };
//   res.render("urls_show", templateVars);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.listen(PORT, () => {
//   // console.log(`Example app listening on port ${PORT}!`);
// });


