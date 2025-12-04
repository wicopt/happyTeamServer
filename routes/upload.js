const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("avatar"), (req, res) => {
    console.log(req.file);
    res.send('Uploaded suck');
});
router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Проверяем существует ли файл
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});
module.exports = router;
