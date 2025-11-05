const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const PromoCode = require('../models/PromoCode');

// @route   POST /api/promo/validate
// @desc    Validate a promo code
// @access  Private
router.post('/validate', auth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }

    if (!promoCode.isValid()) {
      let reason = 'This promo code is not valid';
      
      if (!promoCode.isActive) reason = 'This promo code has been deactivated';
      else if (promoCode.validFrom && promoCode.validFrom > new Date()) reason = 'This promo code is not yet active';
      else if (promoCode.validUntil && promoCode.validUntil < new Date()) reason = 'This promo code has expired';
      else if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) reason = 'This promo code has reached its usage limit';
      
      return res.status(400).json({ message: reason });
    }

    res.json({
      valid: true,
      code: promoCode.code,
      discountPercent: promoCode.discountPercent,
      description: promoCode.description
    });
  } catch (error) {
    console.error('Promo code validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/promo/admin
// @desc    Get all promo codes
// @access  Private (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/promo/admin
// @desc    Create a new promo code
// @access  Private (Admin only)
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const { code, discountPercent, description, maxUses, validUntil } = req.body;

    if (!code || !discountPercent) {
      return res.status(400).json({ message: 'Code and discount percent are required' });
    }

    if (discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: 'This promo code already exists' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discountPercent,
      description: description || '',
      maxUses: maxUses || null,
      validUntil: validUntil || null,
      createdBy: req.user._id
    });

    await promoCode.save();

    res.status(201).json({
      message: 'Promo code created successfully',
      promoCode
    });
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/promo/admin/:id
// @desc    Update a promo code
// @access  Private (Admin only)
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { discountPercent, description, isActive, maxUses, validUntil } = req.body;

    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    if (discountPercent !== undefined) {
      if (discountPercent < 0 || discountPercent > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100' });
      }
      promoCode.discountPercent = discountPercent;
    }

    if (description !== undefined) promoCode.description = description;
    if (isActive !== undefined) promoCode.isActive = isActive;
    if (maxUses !== undefined) promoCode.maxUses = maxUses || null;
    if (validUntil !== undefined) promoCode.validUntil = validUntil || null;

    await promoCode.save();

    res.json({
      message: 'Promo code updated successfully',
      promoCode
    });
  } catch (error) {
    console.error('Error updating promo code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/promo/admin/:id
// @desc    Delete a promo code
// @access  Private (Admin only)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    await PromoCode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



