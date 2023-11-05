const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


const { generateRandomString } = require("./function");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.use(express.urlencoded({ extended: true }));

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  //const id = req.params.id;
  //const longURL = urlDatabase[id]; // Retrieve the long URL from urlDatabase

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]['longURL'],
  };
  res.render("urls_show", templateVars);

});
app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id]["longURL"];
    res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  const newLongURL = req.body.longURL;
  urlDatabase[id] = { longURL: req.body.longURL };
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
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });

 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




