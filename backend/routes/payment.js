const express = require('express');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const PromoCode = require('../models/PromoCode');
const { sendEnrollmentEmail } = require('../services/emailService.resend');

// Initialize Cashfree for SDK v5
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CASHFREE_APP_ID:', process.env.CASHFREE_APP_ID);
console.log('CASHFREE_SECRET_KEY exists:', !!process.env.CASHFREE_SECRET_KEY);

// Initialize Cashfree with proper configuration
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.PRODUCTION;

console.log('Cashfree configured for PRODUCTION environment');
console.log('Cashfree Environment:', Cashfree.XEnvironment);

// @route   POST /api/payment/create-order
// @desc    Create a payment order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const user = req.user;
    const { promoCode } = req.body;

    console.log('Creating payment order for user:', user.email);

    // Check if user is already enrolled
    if (user.isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in the course' });
    }

    // Get course info for pricing
    const course = await Course.findOne();
    if (!course) {
      return res.status(404).json({ message: 'Course information not found' });
    }

    // Calculate base amount with GST (18%)
    let baseAmount = Math.round(course.price * 1.18);
    let discountPercent = 0;
    let discountAmount = 0;
    let appliedPromoCode = null;

    // Apply promo code if provided
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
      if (promo && promo.isValid()) {
        discountPercent = promo.discountPercent;
        discountAmount = Math.round((baseAmount * discountPercent) / 100);
        appliedPromoCode = promo.code;
        
        // Increment usage count
        promo.usedCount += 1;
        await promo.save();
        
        console.log('Promo code applied:', { code: promo.code, discount: discountPercent });
      }
    }

    const totalAmount = baseAmount - discountAmount;

    // Generate unique order ID
    const orderId = `ORDER_${user._id}_${Date.now()}`;

    console.log('Order details:', { orderId, baseAmount, discountAmount, totalAmount });

    // Create payment record in database
    const payment = new Payment({
      userId: user._id,
      orderId: orderId,
      orderAmount: totalAmount,
      orderCurrency: 'INR',
      paymentStatus: 'PENDING',
      promoCode: appliedPromoCode,
      discountPercent: discountPercent,
      discountAmount: discountAmount
    });

    await payment.save();
    console.log('Payment record created in database');

    // Create Cashfree order
    const request = {
      order_amount: totalAmount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_email: user.email,
        customer_phone: user.phone || '9999999999',
        customer_name: user.name
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment/verify?order_id=${orderId}`
      }
    };

    console.log('Calling Cashfree API...');
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    console.log('Cashfree response received:', response);
    
    if (response && response.data) {
      // Update payment with session ID
      payment.paymentSessionId = response.data.payment_session_id;
      await payment.save();

      res.json({
        success: true,
        orderId: orderId,
        paymentSessionId: response.data.payment_session_id,
        orderAmount: totalAmount
      });
    } else {
      throw new Error('Invalid response from Cashfree');
    }

  } catch (error) {
    console.error('Payment order creation error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error creating payment order',
      error: error.response?.data?.message || error.message 
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment status
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Get payment from database
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify with Cashfree - Fetch order details
    console.log('Fetching order from Cashfree:', orderId);
    const orderResponse = await Cashfree.PGFetchOrder("2023-08-01", orderId);
    console.log('Cashfree order response:', orderResponse.data);
    
    if (orderResponse && orderResponse.data) {
      const orderData = orderResponse.data;
      const orderStatus = orderData.order_status;
      
      console.log('Order status:', orderStatus);
      
      // Update payment record based on order status
      if (orderStatus === 'PAID') {
        payment.paymentStatus = 'SUCCESS';
        payment.paymentTime = new Date();
        
        // Try to get payment details
        try {
          const paymentsResponse = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
          if (paymentsResponse.data && paymentsResponse.data.length > 0) {
            const paymentData = paymentsResponse.data[0];
            payment.paymentMethod = paymentData.payment_group || null;
            payment.transactionId = paymentData.cf_payment_id || null;
          }
        } catch (err) {
          console.log('Could not fetch payment details:', err.message);
        }
        
        await payment.save();
        console.log('Payment record updated to SUCCESS');

        // Enroll user
        const user = await User.findById(payment.userId);
        if (user && !user.isEnrolled) {
          user.isEnrolled = true;
          user.enrolledDate = new Date();
          await user.save();
          console.log('User enrolled successfully:', user.email);
          
          // Send enrollment confirmation email
          const orderDetails = {
            orderId: payment.orderId,
            amount: payment.orderAmount,
            paymentTime: payment.paymentTime || new Date(),
            transactionId: payment.transactionId
          };
          
          // Send email to user
          sendEnrollmentEmail(user.email, user.name, orderDetails)
            .then(result => {
              if (result.success) {
                console.log('Enrollment email sent to:', user.email);
              } else {
                console.error('Failed to send enrollment email:', result.error);
              }
            })
            .catch(err => console.error('Email sending error:', err));
        }

        return res.json({
          success: true,
          message: 'Payment successful! You are now enrolled.',
          paymentStatus: 'SUCCESS'
        });
      } else if (orderStatus === 'ACTIVE') {
        // Payment pending
        return res.json({
          success: false,
          message: 'Payment is still pending. Please complete the payment.',
          paymentStatus: 'PENDING'
        });
      } else {
        // Payment failed or cancelled
        payment.paymentStatus = 'FAILED';
        await payment.save();
        
        return res.json({
          success: false,
          message: 'Payment failed or was cancelled. Please try again.',
          paymentStatus: 'FAILED'
        });
      }
    } else {
      return res.json({
        success: false,
        message: 'Could not verify payment. Please contact support.',
        paymentStatus: 'PENDING'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    console.error('Error details:', error.response?.data);
    res.status(500).json({ 
      message: 'Error verifying payment',
      error: error.message 
    });
  }
});

// @route   GET /api/payment/status/:orderId
// @desc    Get payment status
// @access  Private
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId, userId: req.user._id });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      orderId: payment.orderId,
      amount: payment.orderAmount,
      status: payment.paymentStatus,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      paymentTime: payment.paymentTime,
      createdAt: payment.createdAt
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
});

// @route   GET /api/payment/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// @route   GET /api/payment/check-pending
// @desc    Check if user has any pending payments
// @access  Private
router.get('/check-pending', auth, async (req, res) => {
  try {
    const pendingPayment = await Payment.findOne({ 
      userId: req.user._id,
      paymentStatus: 'PENDING'
    }).sort({ createdAt: -1 });

    if (pendingPayment) {
      // Check status with Cashfree
      try {
        const orderResponse = await Cashfree.PGFetchOrder("2023-08-01", pendingPayment.orderId);
        if (orderResponse && orderResponse.data) {
          const orderStatus = orderResponse.data.order_status;
          
          res.json({
            hasPending: orderStatus === 'ACTIVE' || orderStatus === 'PAID',
            payment: {
              orderId: pendingPayment.orderId,
              amount: pendingPayment.orderAmount,
              status: orderStatus,
              createdAt: pendingPayment.createdAt
            }
          });
          return;
        }
      } catch (err) {
        console.log('Error checking pending payment:', err.message);
      }
    }

    res.json({ hasPending: false });
  } catch (error) {
    console.error('Check pending error:', error);
    res.status(500).json({ message: 'Error checking pending payments' });
  }
});

// @route   POST /api/payment/webhook
// @desc    Handle Cashfree webhook
// @access  Public (but should verify signature in production)
router.post('/webhook', async (req, res) => {
  try {
    const { orderId, orderAmount, paymentStatus, referenceId } = req.body.data;

    const payment = await Payment.findOne({ orderId });
    
    if (payment) {
      payment.paymentStatus = paymentStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED';
      payment.transactionId = referenceId;
      payment.paymentTime = new Date();
      
      await payment.save();

      // Enroll user if payment successful
      if (payment.paymentStatus === 'SUCCESS') {
        const user = await User.findById(payment.userId);
        if (user && !user.isEnrolled) {
          user.isEnrolled = true;
          user.enrolledDate = new Date();
          await user.save();
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
});

module.exports = router;
