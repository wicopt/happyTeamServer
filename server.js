const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

// Конфиги
const { pool } = require("./config/dbConfig");
const initializePassport = require("./config/passportConfig");

const authRoutes = require("./routes/auth");
const depRoutes = require("./routes/departments");
const usersRoutes = require("./routes/users");
initializePassport(passport);

const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // ← ДОБАВЬТЕ
    saveUninitialized: false, // ← ДОБАВЬТЕ
    cookie: {
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      httpOnly: true // защита от XSS
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.send("Hello?");
});
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/departments", depRoutes);

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Ошибка подключения к БД:", err);
  }
  console.log("Подключение к БД успешно");
  release();
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
