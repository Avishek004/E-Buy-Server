const Category = require("../Models/category");
const Product = require("../Models/product");
const SubCategory = require("../Models/subCategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await new Category({ name, slug: slugify(name) }).save();
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(400).send("Create Category failed");
    }
};

exports.list = async (req, res) => {
    const category = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(category);
};

exports.read = async (req, res) => {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ category })
        .populate("category")
        .exec();

    res.json({ category, products });
};

exports.update = async (req, res) => {
    const { name } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).send("Update Category failed");
    }
};

exports.remove = async (req, res) => {
    try {
        const deleteCategory = await Category.findOneAndDelete({ slug: req.params.slug });
        res.json(deleteCategory);
    } catch (error) {
        res.status(400).send("Delete Category failed");
    }
};

exports.getSubs = (req, res) => {
    SubCategory.find({ parent: req.params._id }).exec((error, subs) => {
        if (error) {
            console.log(error);
        } else {
            res.json(subs);
        }
    })
}

