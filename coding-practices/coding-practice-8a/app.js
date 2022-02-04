const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const PORT = 3000;
const initServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database base connected!");
    app.listen(PORT, (error) => {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log(`Server listening at http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const createTable = async (tableName) => {
  try {
    await initServerAndDb();
    sqlQ = `create table ${tableName} (
        id int,
        todo text,
        priority text,
        status text
    );`;
    let dbResponse = null;
    try {
      dbResponse = await db.run(sqlQ);
      console.log(`Table Name : '${tableName}' Created`);
    } catch (error) {
      if (error) {
        if (error.errno === 1) {
          console.log(`Table '${tableName}' Already Exist`);
        } else {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
createTable("todo");
app.get("/todos/", async (request, response) => {
  try {
    const { status = "", priority = "", search_q = "" } = request.query;
    //sql query to fetch todo according to query parameter
    const sqlQ = `select * from todo
    where status LIKE "%${status}%" and priority LIKE "%${priority}%"
    and todo LIKE "%${search_q}%";`;
    const dbResponse = await db.all(sqlQ);
    console.log(dbResponse);
    response.send(dbResponse);
  } catch (error) {
    console.log("error: " + error);
  }
});

app.get("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const sqlQ = `select * from todo where id = ${todoId}`;
    const dbResponse = await db.get(sqlQ);
    response.send(dbResponse);
  } catch (error) {
    console.log("error: " + error);
  }
});

app.post("/todos/", async (request, response) => {
  try {
    const { id, todo, priority, status } = request.body;
    sqlQ = `insert into todo 
      (id,todo,priority,status) values (${id},'${todo}','${priority}','${status}');`;
    const dbResponse = await db.run(sqlQ);
    response.send("Todo Successfully Added");
  } catch (error) {
    console.log("error: " + error);
  }
});

app.put("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { status, priority, todo } = request.body;
    if (status) {
      const sqlQ = `update todo set status = '${status}' where id = ${todoId}`;
      await db.get(sqlQ);
      response.send("Status Updated");
    }
    if (todo) {
      const sqlQ = `update todo set todo = '${todo}' where id = ${todoId}`;
      await db.get(sqlQ);
      response.send("Todo Updated");
    }
    if (priority) {
      const sqlQ = `update todo set priority = '${priority}' where id = ${todoId}`;
      await db.get(sqlQ);
      response.send("Priority Updated");
    }
  } catch (error) {
    console.log("error: " + error);
  }
});

app.delete("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    sqlQ = `delete from todo where id =${todoId};`;
    await db.run(sqlQ);
    response.send(`Todo Deleted`);
  } catch (error) {
    console.log("error: " + error);
  }
});

module.exports = app;
