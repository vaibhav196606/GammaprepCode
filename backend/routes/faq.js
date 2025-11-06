const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/faq
// @desc    Get all active FAQs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/faq/admin
// @desc    Get all FAQs (admin)
// @access  Private/Admin
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/faq
// @desc    Create a new FAQ
// @access  Private/Admin
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = new FAQ({
      question,
      answer,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/faq/:id
// @desc    Update an FAQ
// @access  Private/Admin
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;
    faq.updatedAt = Date.now();

    await faq.save();
    res.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/faq/:id
// @desc    Delete an FAQ
// @access  Private/Admin
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.deleteOne();
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

