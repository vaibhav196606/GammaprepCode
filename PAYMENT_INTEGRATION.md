# Cashfree Payment Integration Guide

This document explains the payment flow integration with Cashfree Payment Gateway.

## Overview

The Gammaprep website uses **Cashfree Payment Gateway** to process course enrollment payments securely. The integration supports multiple payment methods including Credit/Debit Cards, UPI, Net Banking, and Wallets.

## Configuration

### Backend Configuration

The following environment variables are configured in `backend/.env`:

```env
CASHFREE_APP_ID=882200a277719ea3e3c30d88302288
CASHFREE_SECRET_KEY=7c854a8b5f96ad8a362d6f8c25f5bc0bfd9db61e
CASHFREE_API_VERSION=2023-08-01
FRONTEND_URL=http://localhost:3000
```

### Environment

- **Sandbox Mode**: For testing (default in development)
- **Production Mode**: For live payments (when NODE_ENV=production)

**Note**: Current credentials are for **sandbox/testing** mode. Replace with production credentials before going live.

## Payment Flow

### 1. User Journey

```
User Dashboard → "Proceed to Payment" → Payment Page → Cashfree Checkout → Payment Verification → Dashboard (Enrolled)
```

### 2. Technical Flow

#### Step 1: Create Payment Order
- User clicks "Proceed to Payment" on dashboard
- Frontend navigates to `/payment` page
- User reviews order and clicks "Pay" button
- Frontend calls `POST /api/payment/create-order`
- Backend creates:
  - Payment record in MongoDB (status: PENDING)
  - Cashfree order via API
- Backend returns `paymentSessionId` and `orderId`

#### Step 2: Cashfree Checkout
- Frontend loads Cashfree SDK
- Initiates checkout with `paymentSessionId`
- User completes payment on Cashfree hosted page
- Cashfree redirects to `FRONTEND_URL/payment/verify?order_id=ORDER_ID`

#### Step 3: Payment Verification
- Frontend calls `POST /api/payment/verify` with `orderId`
- Backend fetches payment status from Cashfree API
- Backend updates payment record in database
- If payment successful:
  - User's `isEnrolled` set to `true`
  - User's `enrolledDate` set to current date
  - Payment status updated to 'SUCCESS'
- Frontend shows success/failure message

## API Endpoints

### Create Payment Order
```
POST /api/payment/create-order
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORDER_690b5c2e3c1f7cdc93f10fe0_1699999999999",
  "paymentSessionId": "session_xxx...",
  "orderAmount": 17700
}
```

### Verify Payment
```
POST /api/payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "ORDER_690b5c2e3c1f7cdc93f10fe0_1699999999999"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment successful! You are now enrolled.",
  "paymentStatus": "SUCCESS"
}
```

### Get Payment Status
```
GET /api/payment/status/:orderId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orderId": "ORDER_xxx",
  "amount": 17700,
  "status": "SUCCESS",
  "paymentMethod": "UPI",
  "transactionId": "cf_payment_xxx",
  "paymentTime": "2024-01-01T10:00:00.000Z",
  "createdAt": "2024-01-01T09:55:00.000Z"
}
```

### Get Payment History
```
GET /api/payment/history
Authorization: Bearer <token>
```

Returns array of all payments for the authenticated user.

### Webhook (for automated updates)
```
POST /api/payment/webhook
```

Receives payment status updates from Cashfree automatically.

## Database Schema

### Payment Model

```javascript
{
  userId: ObjectId (ref: User),
  orderId: String (unique),
  orderAmount: Number,
  orderCurrency: String (default: 'INR'),
  paymentSessionId: String,
  paymentStatus: Enum ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
  paymentMethod: String,
  transactionId: String,
  paymentTime: Date,
  createdAt: Date
}
```

## Pricing Structure

- **Base Course Fee**: ₹15,000 (configurable by admin)
- **GST (18%)**: ₹2,700
- **Total Amount**: ₹17,700

The total amount (including GST) is automatically calculated during order creation.

## Admin Features

Admin panel includes:

1. **Statistics Dashboard**
   - Total Users
   - Enrolled Users
   - Successful Payments
   - Total Revenue

2. **Payment History Tab**
   - View all payment transactions
   - Filter by status
   - See user details
   - Transaction IDs and dates

3. **Manual Enrollment**
   - Admin can manually enroll users without payment
   - Useful for special cases or offline payments

## Testing

### Test Payment in Sandbox

1. Start both backend and frontend servers
2. Register a new user
3. Login and go to Dashboard
4. Click "Proceed to Payment"
5. On payment page, click "Pay" button
6. Use Cashfree sandbox test credentials:
   - **Test Card**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **OTP**: 123456

### Test Different Scenarios

- **Successful Payment**: Use test card with OTP 123456
- **Failed Payment**: Cancel the payment on Cashfree page
- **Pending Payment**: Close browser during payment

## Security Features

1. **JWT Authentication**: All payment endpoints require valid JWT token
2. **User Verification**: Users can only create orders and view payments for themselves
3. **Admin Authorization**: Payment history and stats require admin privileges
4. **HTTPS Required**: In production, all payment pages must use HTTPS
5. **Webhook Signature**: (Recommended) Verify Cashfree webhook signatures

## Production Checklist

Before going live:

- [ ] Replace sandbox credentials with production credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS on frontend and backend
- [ ] Configure webhook signature verification
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Test complete payment flow in production mode
- [ ] Set up payment monitoring and alerts
- [ ] Configure email notifications for successful payments
- [ ] Add refund handling mechanism
- [ ] Set up payment reconciliation process

## Troubleshooting

### Payment Order Creation Fails
- Check if MongoDB is running
- Verify Cashfree credentials in .env
- Check backend logs for error messages
- Ensure course information exists in database

### Payment Verification Fails
- Check if orderId is correct
- Verify Cashfree API is accessible
- Check if payment was actually completed on Cashfree
- Look for errors in backend logs

### User Not Enrolled After Payment
- Check payment status in database
- Verify webhook is receiving updates
- Manually verify payment on Cashfree dashboard
- Check if user's `isEnrolled` field updated

### Cashfree SDK Not Loading
- Check internet connection
- Verify script tag in `_document.js`
- Check browser console for errors
- Ensure no ad-blocker is blocking the SDK

## Support

For Cashfree-specific issues:
- **Documentation**: https://docs.cashfree.com/
- **Support**: https://www.cashfree.com/contact-us/

For application issues:
- Check backend logs
- Check browser console
- Review MongoDB records
- Contact: info@gammaprep.com

## Additional Resources

- [Cashfree Payment Gateway Docs](https://docs.cashfree.com/docs/payment-gateway)
- [Cashfree Node.js SDK](https://github.com/cashfree/cashfree-pg-sdk-nodejs)
- [Cashfree Test Credentials](https://docs.cashfree.com/docs/test-data)

---

**Last Updated**: November 2024
**Version**: 1.0.0




