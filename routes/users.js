const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");

// Получить текущего пользователя
router.get("/user", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await UserService.getProfile(req.user.user_id);
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;