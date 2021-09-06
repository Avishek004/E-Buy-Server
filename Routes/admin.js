const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require('../middleWares/auth')

// Controllers
const { orders, orderStatus } = require("../controllers/admin");

// Routes
router.get('/admin/orders', authCheck, adminCheck, orders);
router.put('/admin/order-status', authCheck, adminCheck, orderStatus);


module.exports = router;