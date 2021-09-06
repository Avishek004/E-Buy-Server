const SubCategory = require("../Models/subCategory");
const Product = require("../Models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const subCategory = await new SubCategory({ name, parent, slug: slugify(name) }).save();
        res.json(subCategory);
    } catch (error) {
        console.log(error);
        res.status(400).send("SubCategory Create failed");
    }
};

exports.list = async (req, res) => {
    const subCategory = await SubCategory.find({}).sort({ createdAt: -1 }).exec();
    res.json(subCategory);
};

exports.read = async (req, res) => {
    let subCategory = await SubCategory.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ subs: subCategory })
        .populate("category")
        .exec();

    res.json({ subCategory, products });
};

exports.update = async (req, res) => {
    const { name, parent } = req.body;
    try {
        const updatedSubCategory = await SubCategory.findOneAndUpdate(
            { slug: req.params.slug },
            { name, parent, slug: slugify(name) },
            { new: true }
        );
        res.json(updatedSubCategory);
    } catch (error) {
        res.status(400).send("SubCategory Update failed");
    }
};

exports.remove = async (req, res) => {
    try {
        const deleteSubCategory = await SubCategory.findOneAndDelete({ slug: req.params.slug });
        res.json(deleteSubCategory);
    } catch (error) {
        res.status(400).send("SubCategory Delete failed");
    }
};