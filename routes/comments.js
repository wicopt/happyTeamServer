const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
router.get("/:wishId", async (req, res) => {
  const wishId = req.params.wishId;
  console.log("Requested wishId:", wishId);

  try {
    const comments = await Comments.findAll(wishId);

    console.log(comments); // ← вот это покажет, что ты возвращаешь

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;