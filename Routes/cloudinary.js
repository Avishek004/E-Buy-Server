const express = require('express');
const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require("../middleWares/auth");

// Controllers
const { upload, remove } = require("../controllers/cloudinary");

// Routes
router.post("/uploadimages", authCheck, adminCheck, upload);
router.post("/removeimage", authCheck, adminCheck, remove);

module.exports = router;