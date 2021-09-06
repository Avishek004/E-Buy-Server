const Coupon = require('../Models/coupon');

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        const { name, expiry, discount } = req.body.coupon;
        let newCoupon = await new Coupon({ name, expiry, discount }).save();
        res.json(newCoupon);
    } catch (error) {
        console.error(error);
    }
};

exports.remove = async (req, res) => {
    try {
        let removeCoupon = await Coupon.findByIdAndDelete(req.params.couponId).exec();
        res.json(removeCoupon);
    } catch (error) {
        console.error(error);
    }
};

exports.list = async (req, res) => {
    try {
        let allCoupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();
        res.json(allCoupons);
    } catch (error) {
        console.error(error);
    }
};