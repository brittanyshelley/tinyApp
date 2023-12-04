const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');


const { generateRandomString, getUserByEmail, checkIfAlreadyRegistered, getUserById } = require("./function");

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
  console.log(`ROUTE: ${req.method} ${req.url}`);
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
  const templateVars = { user: users[req.session.userId] };
  res.render("urls_login", templateVars);
  console.log('TESTING')
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
  console.log('req.session.userId:', req.session.user_id);
  console.log('foundUser.id:', foundUser.id);
  res.redirect('/urls');
});

// // GET /protected
// app.get("/protected", (req, res) => {
//   const userId = req.session.userId;
//    // do they NOT have a cookie?
//    if (!userId) {
//     return res.status(401).send('you must be signed in to see this page');
//   }
//   // Retrieve the user object from the database, Render protected page
//   const user = users[userId];
//   if (!user) {
//     return res.status(404).send('User not found');
//   }
//   const templateVars = { email: user.email};
//   res.render("protected", templateVars);
// });

//Logout, clear username cookie and redirect to /urls
app.post('/logout', (req, res) => {
  req.session.user_id = null; // clear all cookies
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  const user_id = req.session.user_id;//Get the user_id from the session
  console.log('session user_id:', req.session.user_id);
  console.log('Users database:', users);
  const user = users[user_id];//Used to retrieve users object-user["userRandomID"]
  console.log('Found user:', user);

  const templateVars = { user };//*
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
  console.log('foundUser:', foundUser);
  // did we find a user
  if (foundUser) {
    return res.status(400).send('a user with that email already exists');
  }
  const id = generateRandomString();
  console.log('id:', id);

  // generate the hash
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log('hash:', hash);

  const user = {
    id: id,
    email: email,
    password: hash,
  };
console.log('user:', user);

  // update the users object
  users[id] = user;
  console.log('users[id]:', users[id]);
  console.log('user:', user);

  // Log the user object that was created
  console.log({ id: users[id].id, email: users[id].email, password: users[id].password });

  req.session.user_id = users[id]; // Setting the cookie here //Here we are setting the cookie
  console.log('Session:', users[id]);
  res.redirect('/urls');
});


// app.post("/login", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const user = findUserWithEmail(email);
//   if (user && bcrypt.compareSync(password, user.password)) {
//     req.session.user_id = user.id;
//     res.redirect("/urls");
//   } else {
//     res.status(403).send("Invalid email or password");
//   }
// });
// res.cookie('username', req.body.username);

// Routes

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.session.user_id] };//Passing user object to templateVars
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.session.user_id] };//Passing user object to templateVars
  res.render("urls_new", templateVars);
});

// app.get("/urls/:id", (req, res) => {
//   const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
//   res.render("urls_show", templateVars);
// });

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Retrieve the long URL from urlDatabase
  const templateVars = { id: id, longURL: longURL, user: users[req.session.user_id] };//equal to line 107
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

// //Edit's url from database when button pushed
// app.get('/urls/:id', (req, res) => {
//   const id = req.params.id;
//   const templateVars = {
//     placeToEdit: {
//       id: id,
//       longURL: urlDatabase[id].newLongURL
//     }
//   };
//   res.render('edit', templateVars);
// });

//Update's url from database when button pushed
app.post('/urls/:id', (req, res) => {
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
  const longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});

app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = newLongURL;
  // Redirect or respond with the new URL or any other appropriate action


  //const newlongURL = req.body;
  //newlongURL.id = Math.random().toString(36).substring(2,8);
  //urlDatabase.fetch(newlongURL);
  //const id = generateRandomString();
  //const newlongURL = req.body;
  //urlDatabase[id] = { newlongURL: req.body.longURL };
res.redirect(`/urls/${id}`);
  console.log('TESTING')
  console.log(req.body.longURL); // Log the POST request body to the console

});

app.get("/", (req, res) => {
  res.send("Hello!");
});
//added page to display urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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
//   console.log(`Example app listening on port ${PORT}!`);
// });


