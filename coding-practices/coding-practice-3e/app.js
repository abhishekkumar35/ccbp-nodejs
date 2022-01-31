const express = require("express");
const app = express();
app.get("/", (req, res) => {
  const date = new Date();
  const date_ = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  res.send(`${date_}`);
});

app.listen(3000);
module.exports = app;
