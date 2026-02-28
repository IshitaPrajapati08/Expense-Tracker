const express = require('express');
const router = express.Router();

const Category = require('../middlwares/models/category');

router.post('/categories', async (req, res) => {
  try {
    const { name, color, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
    }

    const category = new Category({ name, color, userId });
    await category.save();

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
router.get('/categories', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const categories = await Category.find({ userId });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /api/categories/:id
router.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router; // ✅ THIS IS VERY IMPORTANT
