const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const connection = mysql.createConnection({
  host: "database-emp.cl8g8w4qcsso.ap-southeast-2.rds.amazonaws.com",
  user: "admin",
  password: "fA61i6G15wIb3Oh5Tebd",
  database: "database_emp",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log("Not Connected to MySQL", err);
    throw err;
  }
  console.log("Connected to MySQL");
  connection.query(
    `CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  office VARCHAR(100),
  salary DECIMAL(10, 2)
);`,
    (err1, results) => {
      if (err1) {
        console.log(err1);
        throw err;
      }
      console.log("Table created");
    }
  );
});

// Create Employee
app.post("/employees", (req, res) => {
  const employee = req.body;
  connection.query("INSERT INTO employees SET ?", employee, (err, results) => {
    if (err) res.json(err);
    res.send(results);
  });
});

// Read Employees
app.get("/employees", (req, res) => {
  connection.query("SELECT * FROM employees", (err, results) => {
    if (err) res.json(err);
    res.json(results);
  });
  // res.send([{ name: "Yatish", email: "yatish@gmail.com" }]);
});

app.get("/employees/:id", (req, res) => {
  const employee = req.body;
  const id = req.params.id;
  connection.query(
    "SELECT * FROM employees WHERE id = ?",
    id,
    (err, results) => {
      if (err) res.json(err);
      res.send(results);
    }
  );
});

// Update Employee
app.put("/employees/:id", (req, res) => {
  const employee = req.body;
  const id = req.params.id;
  connection.query(
    "UPDATE employees SET ? WHERE id = ?",
    [employee, id],
    (err, results) => {
      if (err) res.json(err);
      res.send(results);
    }
  );
});

// Delete Employee
app.delete("/employees/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM employees WHERE id = ?", id, (err, results) => {
    if (err) res.json(err);
    res.send(results);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
