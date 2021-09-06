const express = require('express');

const router = express.Router();

// MiddleWares
const { authCheck } = require('../middleWares/auth')

// Controllers
const { userCart, getUserCart, emptyUserCart, saveAddress, applyCouponToCart, createOrder, orders, addToWishList, wishlist, removeFromWishList, createCashOrder } = require("../controllers/user");

router.post('/user/cart', authCheck, userCart); // save Cart.
router.get('/user/cart', authCheck, getUserCart); // get Cart.
router.delete('/user/cart', authCheck, emptyUserCart); // empty Cart.
router.post('/user/address', authCheck, saveAddress);

router.post("/user/order", authCheck, createOrder); // create Order List after successful purchase
router.post("/user/cash-order", authCheck, createCashOrder); // create Order List for cash-on-delivery
router.get("/user/orders", authCheck, orders);

// coupon
router.post('/user/cart/coupon', authCheck, applyCouponToCart);

// WishList
router.post('/user/wishlist', authCheck, addToWishList);
router.get('/user/wishlist', authCheck, wishlist);
router.put('/user/wishlist/:productId', authCheck, removeFromWishList);

module.exports = router;