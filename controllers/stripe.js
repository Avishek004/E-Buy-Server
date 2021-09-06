const Cart = require('../Models/cart');
const User = require('../Models/user');
const Product = require('../Models/product');
const Coupon = require('../Models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    // console.log(req.body);
    const { couponApplied } = req.body;

    // later apply coupon
    // later calculate Price

    // 1. find User
    const user = await User.findOne({ email: req.user.email }).exec();

    // 2. Get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderedBy: user._id }).exec();

    // console.log("CART TOTAL CHANGED", cartTotal, "AFTER DISCOUNT", totalAfterDiscount); 

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
        finalAmount = (totalAfterDiscount * 100);
    } else {
        finalAmount = (cartTotal * 100);
    }

    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: 'USD',
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount,
    })
};