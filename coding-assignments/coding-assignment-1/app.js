const express = require("express");
const isValid = require("date-fns/isValid");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { format } = require("date-fns");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
const PORT = 3000;

let db = null;

async function initializeDBAndServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database Connected!");

    app.listen(PORT, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Server Started and Listening at http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
initializeDBAndServer();

function validateQuery(request, response, next) {
  try {
    const validityObject = {
      status: { "TO DO": 1, "IN PROGRESS": 1, DON: 1 },
      priority: { HIGH: 1, MEDIUM: 1, LOW: 1 },
      category: { WORK: 1, HOME: 1, LEARNING: 1 },
    };
    const {
      status = "",
      priority = "",
      search_q = "",
      category = "",
      date = "",
    } = request.query;

    if (status !== "") {
      if (status in validityObject.status === false) {
        response.status(400);
        response.send("Invalid Todo Status");
      }
    }
    console.log(1);
    if (priority !== "") {
      if (priority in validityObject.priority === false) {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    }
    console.log(2);
    if (category !== "") {
      if (category in validityObject.category === false) {
        response.status(400);
        response.send("Invalid Todo Status");
      }
    }
    console.log(3);
    if (date !== "") {
      console.log(date);
      if (!isValid(new Date(date))) {
        response.status(400);
        response.send("Invalid Due Date");
      }
    } else {
      console.log(5);
      next();
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/todos", validateQuery, async (request, response) => {
  try {
    const {
      status = "",
      priority = "",
      search_q = "",
      category = "",
      date = "",
    } = request.query;

    if (date !== "") {
      date = format(new Date(date), "yyyy-MM-dd");
    }
    const sqlQ = `SELECT id,todo,priority,category,status,due_date as dueDate
   FROM 
     todo 
   WHERE
    status LIKE "%${status}%" 
    AND
    priority LIKE "%${priority}%"
    AND
    todo LIKE "%${search_q}%"
    AND
    category LIKE "%${category}%"
    AND
    due_date LIKE "%${date}%"
  `;

    const dbResponse = await db.all(sqlQ);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const sqlQ = `SELECT id,todo,priority,category,status,due_date as dueDate
   FROM 
     todo 
   WHERE id =${todoId}`;
    const dbResponse = await db.get(sqlQ);
    response.send(dbResponse);
  } catch (error) {
    console.log(error);
  }
});

app.get("/agenda/", async (request, response) => {
  const { date } = request.params;

  if (date !== "") {
    date = format(new Date(date), "yyyy-MM-dd");
  }
  const sqlQ = `SELECT id,todo,priority,category,status,due_date as dueDate
   FROM 
     todo 
   WHERE due_date =${date}`;
  const dbResponse = await db.all(sqlQ);
  response.send(dbResponse);
});

app.put("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const {
      status = "",
      todo = "",
      priority = "",
      category = "",
      dueDate = "",
    } = request.body;

    if (status !== "") {
      const sqlQ = `update todo set
      status = '${status}',
      where id = ${todoId};
    `;
      await db.run(sqlQ);
      response.send("Status Updated");
    }
    if (priority !== "") {
      const sqlQ = `update todo set
      priority = '${priority}',
      where id = ${todoId};
    `;
      await db.run(sqlQ);
      response.send("Priority Updated");
    }
    if (dueDate !== "") {
      if (!isValid(new Date(dueDate))) {
        response.status(400);
        response.send("Invalid Due Date");
      } else {
        dueDate = format(new Date(date), "yyyy-MM-dd");

        const sqlQ = `update todo set
      due_date = '${dueDate}',
      where id = ${todoId};
    `;
        await db.run(sqlQ);
        response.send("Due Date Updated");
      }
    }
    if (todo !== "") {
      const sqlQ = `update todo set
      todo = '${todo}',
      where id = ${todoId};
    `;
      await db.run(sqlQ);
      response.send("Todo Updated");
    }
    if (category !== "") {
      const sqlQ = `update todo set
      category = '${category}',
      where id = ${todoId};
    `;
      await db.run(sqlQ);
      response.send("Todo Updated");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/todos", async (request, response) => {
  try {
    const {
      id = -1,
      status = "",
      todo = "",
      priority = "",
      category = "",
      dueDate = "",
    } = request.body;
    if (dueDate !== "") {
      if (!isValid(new Date(dueDate))) {
        response.status(400);
        response.send("Invalid Due Date");
      } else {
        dueDate = format(new Date(date), "yyyy-MM-dd");
        const sqlQ = `insert
            into todo 
            (id,todo,priority,status,category,due_date) 
            values 
            (${id},'${status}','${todo}','${priority}','${category}','${dueDate}');
            `;
        await db.run(sqlQ);
        response.send("Todo Successfully Added");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const sqlQ = `DELETE FROM 
     todo 
   WHERE id =${todoId}`;
    await db.get(sqlQ);
    response.send("Todo Deleted");
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
