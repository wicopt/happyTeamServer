const express = require("express");
const router = express.Router();
const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Функция для получения департаментов (вынесена для переиспользования)
const getDepartments = async () => {
  try {
    const result = await pool.query("SELECT department_id, department_name FROM departments");
    return result.rows;
  } catch (err) {
    console.error("Ошибка загрузки отделов:", err);
    return [];
  }
};

router.get("/register", async (req, res) => {
  try {
    const departments = await getDepartments();
    res.render("register", { departments, errors: [] });
  } catch (err) {
    console.error("Ошибка:", err);
    res.render("register", { departments: [], errors: [] });
  }
});

router.post("/register", async (req, res) => {
  let {
    username,
    name,
    surname,
    patronymic,
    department_id,
    birthday,
    password,
    password2,
  } = req.body;

  let errors = [];

  console.log("Данные из формы:", req.body);

  // Валидация
  if (!name || !password || !password2 || !birthday || !surname || !department_id) {
    errors.push({ message: "Please enter all required fields" });
  }

  if (password && password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  // Если есть ошибки - загружаем departments и показываем форму с ошибками
  if (errors.length > 0) {
    try {
      const departments = await getDepartments();
      res.render("register", {
        departments,  // ← ТЕПЕРЬ ПЕРЕДАЕМ!
        errors,
        username: username || "",
        name: name || "",
        surname: surname || "",
        patronymic: patronymic || "",
        department_id: department_id || "",
        birthday: birthday || "",
        password: password || "",
        password2: password2 || "",
      });
    } catch (err) {
      console.error("Ошибка при рендеринге:", err);
      res.status(500).send("Server error");
    }
    return;
  }

  // Если валидация прошла успешно
  try {
    // Проверяем, существует ли пользователь
    const userCheck = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (userCheck.rows.length > 0) {
      const departments = await getDepartments();
      return res.render("register", {
        departments,  // ← ТЕПЕРЬ ПЕРЕДАЕМ!
        errors: [{ message: "Username already registered" }],
        username: username || "",
        name: name || "",
        surname: surname || "",
        patronymic: patronymic || "",
        department_id: department_id || "",
        birthday: birthday || "",
        password: password || "",
        password2: password2 || "",
      });
    }

    // Хешируем пароль и создаем пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await pool.query(
      `INSERT INTO users (username, name, surname, patronymic, department_id, birthday, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING user_id, username, name`,
      [username, name, surname, patronymic, department_id, birthday, hashedPassword]
    );

    console.log("Новый пользователь:", newUser.rows[0]);
    res.send("Пользователь успешно зарегистрирован");

  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    
    // При ошибке БД тоже загружаем departments
    const departments = await getDepartments();
    res.render("register", {
      departments,  // ← ТЕПЕРЬ ПЕРЕДАЕМ!
      errors: [{ message: "Database error during registration" }],
      username: username || "",
      name: name || "",
      surname: surname || "",
      patronymic: patronymic || "",
      department_id: department_id || "",
      birthday: birthday || "",
      password: password || "",
      password2: password2 || "",
    });
  }
});

router.post("/login", (req, res, next) => {
  console.log("Попытка логина");

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      console.log("Неправильные данные");
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }

    req.session.user = user;
    req.session.authorized = true;

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Login successful",
        user
      });
    });
  })(req, res, next);
});


module.exports = router;