const admin = require('../Firebase');
const User = require('../Models/user');

exports.authCheck = async (req, res, next) => {
    // token
    // console.log(req.headers);
    try {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        // console.log("Firebase User in AuthCheck", firebaseUser);
        req.user = firebaseUser;
    } catch (error) {
        res.status(401).json({
            error: "Invalid or expired token",
        });
    }
    next();
};

exports.adminCheck = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email }).exec();
    if (adminUser.role !== 'admin') {
        res.status(403).json({
            error: 'Admin resource. Access denied.',
        })
    } else {
        next();
    }
}