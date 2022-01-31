const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.get("/date", (req, res) => {
  let date = new Date();
  res.send(`Today's date is ${date}`);
});
app.get("/home", (req, res) => {
  res.sendFile("./page.html", { root: __dirname });
});

app.listen(3000);
