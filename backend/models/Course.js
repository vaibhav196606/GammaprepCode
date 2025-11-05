const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    default: 15000
  },
  originalPrice: {
    type: Number,
    default: null // null means no strikethrough price to show
  },
  startDate: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  syllabusPdfUrl: {
    type: String,
    default: null // URL to downloadable syllabus PDF
  },
  stats: {
    studentsEnrolled: {
      type: Number,
      default: 500
    },
    referralRate: {
      type: Number,
      default: 100
    },
    averagePackage: {
      type: Number,
      default: 15 // in LPA
    },
    hiringPartners: {
      type: Number,
      default: 50
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);

