const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:userId/enroll
// @desc    Manually enroll/unenroll a user
// @access  Private (Admin only)
router.put('/users/:userId/enroll', adminAuth, async (req, res) => {
  try {
    const { isEnrolled } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isEnrolled = isEnrolled;
    user.enrolledDate = isEnrolled ? new Date() : null;
    
    await user.save();

    res.json({
      message: `User ${isEnrolled ? 'enrolled' : 'unenrolled'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEnrolled: user.isEnrolled,
        enrolledDate: user.enrolledDate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private (Admin only)
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const enrolledUsers = await User.countDocuments({ isEnrolled: true });
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ paymentStatus: 'SUCCESS' });
    
    const revenueResult = await Payment.aggregate([
      { $match: { paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$orderAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalUsers,
      enrolledUsers,
      notEnrolled: totalUsers - enrolledUsers,
      totalPayments,
      successfulPayments,
      failedPayments: totalPayments - successfulPayments,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
