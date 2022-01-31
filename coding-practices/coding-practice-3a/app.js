const express = require("express");
const addDays = require("date-fns/addDays");

const app = express();

app.get("/", (req, res) => {
  const mdate = addDays(new Date(), 100);
  const date = `${mdate.getDate()}/${
    mdate.getMonth() + 1
  }/${mdate.getFullYear()}`;
  res.send(`${date}`);
});

app.listen(3000);

module.exports = app;
