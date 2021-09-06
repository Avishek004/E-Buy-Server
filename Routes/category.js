const express = require('express');
const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require('../middleWares/auth')

// Controller
const { create, read, update, remove, list, getSubs } = require("../controllers/category");

// Routes
router.post('/category', authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.get('/category/subs/:_id', getSubs);
router.put('/category/:slug', authCheck, adminCheck, update);
router.delete('/category/:slug', authCheck, adminCheck, remove);


module.exports = router;