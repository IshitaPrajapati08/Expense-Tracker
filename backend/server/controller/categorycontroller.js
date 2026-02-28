const Category = require("../middlwares/models/category");

// GET all categories for logged-in user
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST new category for logged-in user
exports.addCategory = async (req, res) => {
  const { name, color } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const exists = await Category.findOne({ name, user: req.user._id });
    if (exists) return res.status(400).json({ error: "Category already exists" });

    const category = await Category.create({ name, color, user: req.user._id });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};
