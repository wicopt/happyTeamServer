const express = require("express");
const router = express.Router();
const { pool } = require("../config/dbConfig");

router.get("/user", (req, res) => {
  if (!req.user) return res.json({ user: null });
  
  // Если обновили passport.deserializeUser (см. ниже), то сразу получаем с department_name
  res.json({ 
    user: {
      ...req.user,
      department: req.user.department_name // используем поле из JOIN
    }
  });
});

router.get("/", async (req, res) => {
  try {
    

    res.json(events);
  } catch (err) {
    console.error("Error loading events:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
