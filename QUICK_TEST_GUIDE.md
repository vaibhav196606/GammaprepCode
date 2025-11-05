# Quick Test Guide - New Features

## 🚀 How to Start & Test

### Step 1: Start Backend
Open a terminal in the project root:
```bash
cd backend
node server.js
```
Should see: "MongoDB connected successfully" and "Server running on port 5000"

### Step 2: Start Frontend
Open **another terminal** in the project root:
```bash
cd frontend
npm run dev
```
Should see: "ready - started server on 0.0.0.0:3000" (or 3001)

---

## ✅ Test Checklist

### Test 1: Edit Profile (2 minutes)
1. Go to http://localhost:3000
2. Login as: `test1@example.com` / `password123`
3. Click "Dashboard" in nav
4. Click **"Edit Profile"** button (top right)
5. Change your name to "Test User Updated"
6. Click **"Save Changes"**
7. ✅ Should see updated name on dashboard

### Test 2: Create Promo Code (2 minutes)
1. Logout and login as: `admin@gammaprep.com` / `admin123`
2. Go to **Admin Panel**
3. Click **"Promo Codes"** tab
4. Click **"Add Promo Code"** button
5. Fill in:
   - Code: `SAVE20`
   - Discount: `20`
   - Description: `Save 20% on your enrollment`
   - Max Uses: `100`
6. Click **"Create Promo Code"**
7. ✅ Should see SAVE20 in the table

### Test 3: Apply Promo Code (3 minutes)
1. Logout and login as: `test1@example.com` / `password123`
2. Go to **Payment** page (click "Complete Payment" from home)
3. Enter `SAVE20` in promo code field
4. Click **"Apply"**
5. ✅ Should see green success message
6. ✅ Should see discount: ₹17,700 → ₹14,160
7. ✅ Original price shown with strikethrough
8. (Optional) Complete payment to test full flow

---

## 🎯 What to Look For

### Dashboard
- **Edit Profile** button next to "Your Details"
- Modal popup with name, email, phone fields
- Changes reflected immediately after save

### Admin Panel
- **Promo Codes** tab (4th tab after Settings)
- Table showing all promo codes
- Create/Edit/Delete/Toggle actions
- Usage statistics (X / Y uses)
- Active/Inactive status badges

### Payment Page
- **"Have a Promo Code?"** section below course details
- Input field that auto-uppercases
- **Apply** button
- Green success banner when valid
- Red error message when invalid
- Discount breakdown in pricing
- Updated total amount
- Remove button (X) when code applied

---

## 📝 Quick Test Script

**Copy-paste these test scenarios:**

### Scenario A: User Journey
```
1. Register new account → user@test.com
2. Go to Dashboard → Click Edit Profile
3. Update name → Save
4. Go to Payment
5. Apply promo code → SAVE20
6. See discount → ₹17,700 to ₹14,160
7. Complete payment
```

### Scenario B: Admin Journey
```
1. Login as admin → admin@gammaprep.com
2. Admin Panel → Promo Codes tab
3. Create code: FLASH50 (50% off)
4. Set max uses: 10
5. Logout → Login as user
6. Apply FLASH50 → See 50% discount
7. Back to admin → Check usage: 1/10
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
npm install
node server.js
```

### Promo code shows invalid
- Check admin panel: Is code Active?
- Check expiry date hasn't passed
- Check max uses not reached

### Profile edit not saving
- Check console for errors
- Verify backend is running
- Check network tab for API response

---

## 📊 Expected Results

### Edit Profile Success
```
✅ Modal opens
✅ Form prefilled with current data
✅ Save button enables when changed
✅ Success message appears
✅ Modal closes
✅ Dashboard shows new data
```

### Create Promo Code Success
```
✅ Form validation works
✅ Code auto-uppercased
✅ Appears in table immediately
✅ Status badge shows "Active"
✅ Usage shows "0 / 100"
```

### Apply Promo Code Success
```
✅ Validation instant (no page reload)
✅ Green success banner
✅ Shows: CODE20 - 20% OFF
✅ Pricing updates:
   - Course Fee: ₹15,000
   - GST (18%): ₹2,700
   - Discount (20%): -₹3,540
   - Total: ₹14,160 ✅
```

---

## 🎉 Success Indicators

**You'll know it works when:**

✅ **Profile Edit:**
- You can change your name/email/phone
- Changes persist after page reload

✅ **Admin Promo Codes:**
- You can create, edit, delete codes
- Toggle active/inactive works
- Table shows all codes with stats

✅ **User Promo Application:**
- Valid codes show green success
- Invalid codes show red error
- Discount calculates correctly
- Total price updates dynamically

---

## 📚 Documentation

**Full guides available:**
- `NEW_FEATURES_GUIDE.md` - Complete user & admin manual
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `README.md` - Main project documentation

---

## 💡 Example Promo Codes to Create

```
Code: LAUNCH50
Discount: 50%
Description: Launch week special!
Max Uses: 20
→ Perfect for limited-time offers

Code: EARLYBIRD
Discount: 30%
Description: Early bird discount
Max Uses: 100
→ For first enrollments

Code: REFER10
Discount: 10%
Description: Referral discount
Max Uses: (empty = unlimited)
→ For sharing with friends
```

---

## ⏱️ Time Estimates

- Profile Edit Test: **2 minutes**
- Create Promo Code: **2 minutes**
- Apply & Test Discount: **3 minutes**
- **Total Testing Time: ~7 minutes**

---

## 🎓 Test Data Available

### Admin Account
```
Email: admin@gammaprep.com
Password: admin123
```

### Test Users (from create-test-users.js)
```
test1@example.com / password123 (Not enrolled)
test2@example.com / password123 (Not enrolled)
enrolled1@example.com / password123 (Enrolled)
enrolled2@example.com / password123 (Enrolled)
```

---

## 🚦 Ready to Test!

1. ✅ Backend running on port 5000
2. ⏳ Start frontend on port 3000/3001
3. ✅ MongoDB connected
4. ✅ All code complete
5. 🎯 Ready for testing!

**Open two terminals and start testing!** 🚀



