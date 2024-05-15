const express = require("express");
const app = (module.exports = express());
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const userData = {
  name: "phanuel",
  lastname: "arsene",
  password: "12345",
};
const mysql = require("mysql");
app.use(express.json({}));
app.use(
  express.urlencoded({
    extended: true,
  })
);
const options = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "session",
};
const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  } /* session store options */,
  connection
);
app.use(
  session({
    key: "keyin",
    secret: "my secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/login", function (req, res) {
  const { usernanme, password } = req.body;
  if (usernanme != userData.username || password != userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is invalid",
    });
  } else {
    req.session.userinfo = userData.lastname;
    res.send("Landing success !");
  }
});
app.use("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (!err) {
      res.send("Log Out!");
    }
  });
});

app.get("/", function (req, res) {
  if (req.session.userinfo) {
    res.send("bonjour " + req.session.userinfo + "Bienvenue");
  } else {
    res.send("Not Logged In");
  }
});
app.listen(4000, console.log("server Running on http://localhost:4000"));
