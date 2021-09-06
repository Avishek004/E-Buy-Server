const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck, adminCheck } = require('../middleWares/auth')

// Controller
const { create, listAll, remove, read, update, list, productsCount, productStar, listRelated, searchFilters } = require("../controllers/product");

// Routes
router.post('/product', authCheck, adminCheck, create);
router.get('/products/total', productsCount);

router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);

router.post('/products', list);

// Rating
router.put('/product/star/:productId', authCheck, productStar);

// Related
router.get('/product/related/:productId', listRelated);

// Search
router.post('/search/filters', searchFilters);

module.exports = router;