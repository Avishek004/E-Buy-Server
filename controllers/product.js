const Product = require('../Models/product');
const User = require('../Models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (error) {
        console.log(error);
        // res.status(400).send("Create Product failed");
        res.status(400).json({
            error: error.message,
        })
    }
};

exports.listAll = async (req, res, next) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subs")
        .sort([["createdAt", "desc"]])
        .exec();
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleteProduct = await Product.findOneAndRemove({ slug: req.params.slug }).exec();
        res.json(deleteProduct);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Product Delete Failed");
    }
};

exports.read = async (req, res) => {
    let product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec();
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updatedProduct);
    } catch (error) {
        console.log(error);
        // return res.status(400).send("Product Update Failed");
        res.status(400).json({
            error: error.message,
        })
    }
};

// Without Pagination
// exports.list = async (req, res) => {
//     try {
//         // createdAt/updateAt, desc/asc, 3
//         const { sort, order, limit } = req.body;
//         const products = await Product.find({})
//             .populate("category")
//             .populate("subs")
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec();
//         res.json(products);
//     } catch (error) {
//         console.log(error);
//     }
// };

// With Pagination
exports.list = async (req, res) => {
    try {
        // console.table(req.body);
        // createdAt/updateAt, desc/asc, 3
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(perPage)
            .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({ email: req.user.email }).exec()
    const { star } = req.body;

    // Who is updating the product?
    // Check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log(ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject }
            },
            {
                $set: { "ratings.$.star": star },
            },
            { new: true }
        ).exec();
        console.log(ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate("category")
        .populate("subs")
        .populate("postedBy")
        .exec();

    res.json(related);
};

// Search / Filter
const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            }
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(products);
    } catch (error) {
        console.log(error);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(products);
    } catch (error) {
        console.log(error);
    }
};

const handleRating = async (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                floorAverage: {
                    $floor: {
                        $avg: "$ratings.star"
                    }
                }
            }
        },
        {
            $match: {
                floorAverage: stars
            }
        }
    ])
        .limit(12)
        .exec((error, aggregates) => {
            if (error) console.log("Aggregate error: ", error);
            Product.find({ _id: aggregates })
                .populate('category', '_id name')
                .populate('subs', '_id name')
                .populate('postedBy', '_id name')
                .exec((error, products) => {
                    if (error) console.log("Product Aggregate error: ", error);
                    res.json(products);
                });
        })
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

exports.searchFilters = async (req, res) => {
    const { query, shipping, color, brand, price, category, stars, sub } = req.body;

    if (query) {
        console.log("query --->", query);
        await handleQuery(req, res, query);
    };

    if (price !== undefined) {
        console.log("price --->", price);
        await handlePrice(req, res, price);
    };

    if (category) {
        console.log("category --->", category);
        await handleCategory(req, res, category);
    };

    if (stars) {
        console.log("stars --->", stars);
        await handleRating(req, res, stars);
    };

    if (sub) {
        console.log("sub --->", sub);
        await handleSub(req, res, sub);
    };

    if (shipping) {
        console.log("shipping --->", shipping);
        await handleShipping(req, res, shipping);
    };

    if (color) {
        console.log("color --->", color);
        await handleColor(req, res, color);
    };

    if (brand) {
        console.log("brand", brand);
        await handleBrand(req, res, brand);
    };

};