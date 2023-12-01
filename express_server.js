const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');


const { generateRandomString } = require("./function");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  uniqueId1: {
    id: "uniqueId1",
    username: "John Doe",
    password: "password",
    email: "  ",
  },
  uniqueId2: {
    id: "uniqueId2",
    username: "Jane Doe",
    password: "password",
    email: "  ",
  }
}


//Middleware
app.use((req, res, next) => {
  console.log(`ROUTE: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
// app.use(cookieSession({
//   name: 'cookie',
//   keys: ['fj39f7vkdn'],
// }));

// GET login
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("login", templateVars);
});

//POST /login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//Logout, clear username cookie and redirect to /urls
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Handle the registration logic here
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Perform registration logic...

  // Redirect or send a response as needed
  res.send('Registration successful!');
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
    username: req.cookies["username"], };
    console.log("cookie:", req.cookies)
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// app.get("/urls/:id", (req, res) => {
//   const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
//   res.render("urls_show", templateVars);
// });

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // Retrieve the long URL from urlDatabase
  const templateVars = { id: id, longURL: longURL };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

//Edit's url from database when button pushed
app.get('/urls/:id', (req, res) => {
  const id = req.params.id;
  const templateVars = {
    placeToEdit: {
      id: id,
      longURL: urlDatabase[id].newLongURL
    }
  };
  res.render('edit', templateVars);
});

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
  console.log(req.body); // Log the POST request body to the console

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


