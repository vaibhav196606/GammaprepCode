const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Course = require('../models/Course');

// @route   GET /api/course
// @desc    Get course information
// @access  Public
router.get('/', async (req, res) => {
  try {
    let course = await Course.findOne();
    
    // If no course exists, create default one
    if (!course) {
      course = new Course({
        price: 15000,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      await course.save();
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/course/price
// @desc    Update course price and original price
// @access  Private (Admin only)
router.put('/price', adminAuth, async (req, res) => {
  try {
    const { price, originalPrice } = req.body;
    
    if (!price || price < 0) {
      return res.status(400).json({ message: 'Invalid price' });
    }

    let course = await Course.findOne();
    if (!course) {
      course = new Course({ price, originalPrice: originalPrice || null });
    } else {
      course.price = price;
      if (originalPrice !== undefined) {
        course.originalPrice = originalPrice || null;
      }
      course.updatedAt = new Date();
    }
    
    await course.save();
    res.json({ message: 'Course price updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/course/start-date
// @desc    Update course start date
// @access  Private (Admin only)
router.put('/start-date', adminAuth, async (req, res) => {
  try {
    const { startDate } = req.body;
    
    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required' });
    }

    let course = await Course.findOne();
    if (!course) {
      course = new Course({ startDate });
    } else {
      course.startDate = new Date(startDate);
      course.updatedAt = new Date();
    }
    
    await course.save();
    res.json({ message: 'Course start date updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/course/syllabus
// @desc    Update syllabus PDF URL
// @access  Private (Admin only)
router.put('/syllabus', adminAuth, async (req, res) => {
  try {
    const { syllabusPdfUrl } = req.body;

    let course = await Course.findOne();
    if (!course) {
      course = new Course({ syllabusPdfUrl });
    } else {
      course.syllabusPdfUrl = syllabusPdfUrl || null;
      course.updatedAt = new Date();
    }
    
    await course.save();
    res.json({ message: 'Syllabus PDF URL updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/course/stats
// @desc    Update course stats
// @access  Private (Admin only)
router.put('/stats', adminAuth, async (req, res) => {
  try {
    const { studentsEnrolled, referralRate, averagePackage, hiringPartners } = req.body;

    let course = await Course.findOne();
    if (!course) {
      course = new Course();
    }

    if (studentsEnrolled !== undefined) course.stats.studentsEnrolled = studentsEnrolled;
    if (referralRate !== undefined) course.stats.referralRate = referralRate;
    if (averagePackage !== undefined) course.stats.averagePackage = averagePackage;
    if (hiringPartners !== undefined) course.stats.hiringPartners = hiringPartners;
    
    course.updatedAt = new Date();
    await course.save();
    
    res.json({ message: 'Course stats updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

