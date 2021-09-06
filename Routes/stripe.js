const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck } = require('../middleWares/auth')

// Controllers
const { createPaymentIntent } = require("../controllers/stripe");

// routes
router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;