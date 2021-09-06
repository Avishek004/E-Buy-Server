const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require('../middleWares/auth')

// Controllers
const { create, remove, list } = require("../controllers/coupon");

// Routes
router.post('/coupon', authCheck, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);


module.exports = router;