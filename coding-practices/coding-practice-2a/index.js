const addDays = require("date-fns/addDays");
module.exports = function (days) {
  const newDate = addDays(new Date(2020, 7, 22), days);
  //   return newDate;
  year = newDate.getFullYear();
  month = newDate.getMonth() + 1;
  days = newDate.getDate();
  return `${year}-${month}-${days}`;
};
