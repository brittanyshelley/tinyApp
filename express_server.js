const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


const { generateRandomString } = require("./function");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Middleware
app.use((req, res, next) => {
  console.log(`ROUTE: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  res.render("urls_show", templateVars);

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


