# New Features Guide - Profile Edit & Promo Codes

## 🎉 What's New

### 1. User Profile Editing
Users can now update their profile information from the dashboard.

### 2. Promo Code System
Admins can create discount codes and users can apply them during checkout.

---

## 📝 User Features

### How to Edit Your Profile

1. **Go to Dashboard**
   - Login to your account
   - Navigate to the Dashboard

2. **Click "Edit Profile" Button**
   - Located next to "Your Details" heading
   - Opens a modal form

3. **Update Your Information**
   - **Full Name**: Update your display name
   - **Email Address**: Change your email (must be unique)
   - **Phone Number**: Add or update phone number (optional)

4. **Save Changes**
   - Click "Save Changes" button
   - Changes are immediately reflected on dashboard

### How to Use a Promo Code

1. **Go to Payment Page**
   - Click "Enroll Now" or "Complete Payment" from homepage
   - Or navigate to `/payment` directly

2. **Enter Promo Code**
   - Find the "Have a Promo Code?" section
   - Enter your promo code (automatically converted to uppercase)
   - Press Enter or click "Apply" button

3. **See Your Discount**
   - Valid codes show a green success message
   - Discount is automatically applied to total
   - Invalid codes show an error message
   - Original price shown with strikethrough when discount applied

4. **Complete Payment**
   - Review the discounted total
   - Click "Pay" button to proceed
   - Discount is permanently saved with your payment

**Example:**
```
Course Fee: ₹15,000
GST (18%): ₹2,700
──────────────────
Subtotal: ₹17,700

Promo Code: SAVE20 (20% OFF)
Discount: -₹3,540
──────────────────
Total Amount: ₹14,160 ✅
```

---

## 👨‍💼 Admin Features

### Managing Promo Codes

#### Access Promo Codes Panel

1. Login as admin (admin@gammaprep.com)
2. Go to Admin Panel
3. Click "Promo Codes" tab

#### Create a New Promo Code

1. **Click "Add Promo Code" Button**

2. **Fill in Details:**
   - **Promo Code*** (Required)
     - Must be uppercase letters/numbers
     - Example: SAVE20, LAUNCH50, EARLYBIRD
     - Cannot be changed after creation

   - **Discount Percentage*** (Required)
     - Number between 0-100
     - Example: 20 (for 20% off)

   - **Description** (Optional)
     - Short description for the offer
     - Example: "Early bird discount for first 100 students"

   - **Max Uses** (Optional)
     - Leave empty for unlimited uses
     - Example: 100 (code becomes invalid after 100 uses)

   - **Valid Until** (Optional)
     - Leave empty for no expiry
     - Select a date for automatic expiration

3. **Click "Create Promo Code"**
   - Success message appears
   - Code is now active and usable

#### Edit an Existing Promo Code

1. Find the promo code in the table
2. Click the pencil/edit icon
3. Modify details (except code itself)
4. Click "Update Promo Code"

**Note:** The promo code text itself cannot be changed after creation. You can only update:
- Discount percentage
- Description
- Max uses
- Expiry date
- Active status

#### Activate/Deactivate a Promo Code

- Click the toggle icon to activate/deactivate
- Deactivated codes cannot be used by users
- Reactivate anytime without losing usage data

#### Delete a Promo Code

1. Click the trash/delete icon
2. Confirm deletion
3. Code is permanently removed

**Warning:** Deletion cannot be undone!

### Promo Code Table Overview

The admin table shows:
- **Code**: The promo code text
- **Discount**: Percentage off
- **Description**: Code description
- **Usage**: Current uses / Max uses
- **Status**: Active or Inactive badge
- **Expiry**: Expiration date or "No expiry"
- **Actions**: Toggle, Edit, Delete buttons

---

## 🔧 Technical Details

### API Endpoints

#### User Profile
```
PUT /api/users/profile
Authorization: Bearer {token}
Body: { name, email, phone }
```

#### Promo Codes (User)
```
POST /api/promo/validate
Authorization: Bearer {token}
Body: { code: "SAVE20" }
```

#### Promo Codes (Admin)
```
GET    /api/promo/admin              - List all codes
POST   /api/promo/admin              - Create new code
PUT    /api/promo/admin/:id          - Update code
DELETE /api/promo/admin/:id          - Delete code
```

#### Payment with Promo Code
```
POST /api/payment/create-order
Authorization: Bearer {token}
Body: { promoCode: "SAVE20" }
```

### Database Models

#### PromoCode Schema
```javascript
{
  code: String (unique, uppercase),
  discountPercent: Number (0-100),
  description: String,
  isActive: Boolean,
  maxUses: Number (null = unlimited),
  usedCount: Number,
  validFrom: Date,
  validUntil: Date (null = no expiry),
  createdBy: ObjectId (User)
}
```

#### Payment Schema (Updated)
```javascript
{
  // ... existing fields ...
  promoCode: String,
  discountPercent: Number,
  discountAmount: Number
}
```

### Promo Code Validation

A promo code is valid when:
- ✅ `isActive` is true
- ✅ Current date >= `validFrom`
- ✅ Current date <= `validUntil` (if set)
- ✅ `usedCount` < `maxUses` (if set)

Invalid codes show specific error messages:
- "This promo code has been deactivated"
- "This promo code is not yet active"
- "This promo code has expired"
- "This promo code has reached its usage limit"

---

## 💡 Example Scenarios

### Scenario 1: Limited-Time Launch Offer

**Admin Creates:**
```
Code: LAUNCH50
Discount: 50%
Description: Launch week special - 50% off
Max Uses: 50
Valid Until: 2025-12-31
```

**User Experience:**
- User enters LAUNCH50 at checkout
- Gets 50% discount on total amount
- After 50 people use it, code becomes invalid
- Expires automatically on Dec 31, 2025

### Scenario 2: Early Bird Discount

**Admin Creates:**
```
Code: EARLYBIRD
Discount: 30%
Description: Early bird discount for first 100 students
Max Uses: 100
Valid Until: (no expiry)
```

**Tracking:**
- Admin can see usage: "45 / 100"
- Knows 45 students have used it
- 55 more can use before it maxes out

### Scenario 3: Referral Discount

**Admin Creates:**
```
Code: REFER10
Discount: 10%
Description: Referral discount
Max Uses: (unlimited)
Valid Until: (no expiry)
```

**Benefits:**
- Can be shared with anyone
- Never expires
- No usage limit
- Can be deactivated anytime if needed

---

## 🐛 Troubleshooting

### Profile Edit Issues

**Q: Email already in use error**
- A: Another user already has that email
- Solution: Try a different email address

**Q: Changes not reflected**
- A: Refresh the page
- The changes are saved but UI might need refresh

### Promo Code Issues

**Q: Valid code shows as invalid**
- Check if code is active in admin panel
- Verify expiry date hasn't passed
- Check if usage limit is reached

**Q: Discount not applied correctly**
- Discount is calculated on subtotal (course fee + GST)
- Rounded to nearest rupee

**Q: Used count doesn't increment**
- Count only increments on successful payment
- Validation doesn't increment the count

---

## 📊 Admin Analytics

Track your promo code performance:

1. **Usage Statistics**
   - See how many times each code was used
   - Compare against max uses

2. **Active vs Inactive**
   - Green badge = Active
   - Red badge = Inactive

3. **Expiry Tracking**
   - Monitor upcoming expirations
   - Renew popular codes before expiry

---

## 🚀 Best Practices

### For Admins

1. **Use Clear Code Names**
   - Good: SAVE20, LAUNCH50, EARLYBIRD
   - Bad: XYZ123, CODE1, TEST

2. **Add Descriptions**
   - Helps you remember what each code is for
   - Shows to users after applying

3. **Set Reasonable Discounts**
   - Consider your margins
   - 10-30% for regular offers
   - 40-50% for special promotions

4. **Monitor Usage**
   - Check which codes are popular
   - Deactivate unused codes
   - Extend expiry for successful campaigns

5. **Test Before Sharing**
   - Create code
   - Test with a user account
   - Then share publicly

### For Users

1. **One Code Per Purchase**
   - Only one promo code can be applied
   - Choose the best available discount

2. **Case Doesn't Matter**
   - save20 = SAVE20
   - Automatically converted to uppercase

3. **Verify Before Paying**
   - Double-check discount amount
   - See final total before clicking Pay

---

## ✅ Summary

**User Benefits:**
- ✏️ Edit profile anytime from dashboard
- 💰 Save money with promo codes
- 📱 Clean, intuitive interface

**Admin Benefits:**
- 🎫 Create unlimited promo codes
- 📊 Track usage and performance
- ⚙️ Full control (edit, toggle, delete)
- 🎯 Flexible options (expiry, limits, discounts)

**Technical Highlights:**
- ✅ Secure validation
- ✅ Real-time updates
- ✅ Usage tracking
- ✅ Comprehensive error handling
- ✅ Mobile-responsive design

---

## 🎓 Quick Reference

### Admin Login Credentials
```
Email: admin@gammaprep.com
Password: admin123
```

### Test Promo Code Creation
```
Code: TEST20
Discount: 20%
Description: Test discount code
Max Uses: 10
Valid Until: (1 month from now)
```

### Test User for Testing
```
Email: test1@example.com
Password: password123
```

---

Need help? Contact the development team or check the main README.md for more information.



