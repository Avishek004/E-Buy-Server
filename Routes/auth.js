const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require('../middleWares/auth')

// Controller
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);

module.exports = router;