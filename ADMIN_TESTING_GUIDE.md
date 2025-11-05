# Admin Panel Testing Guide

## 🎯 Admin Credentials

You now have **2 admin accounts** to test with:

### Option 1: Your Existing Account
```
📧 Email: admin@gammaprep.com
🔑 Password: (your existing password)
⚡ Status: Admin ✓
```

### Option 2: Fresh Test Admin
```
📧 Email: testadmin@gammaprep.com
🔑 Password: admin123
⚡ Status: Admin ✓
```

## 👥 Test Users Created

### Not Enrolled Users (2)
Test enrolling/unenrolling these users:

```
📧 john@example.com
🔑 test123
👤 John Doe
📱 9876543210
✅ Status: Not Enrolled
```

```
📧 sarah@example.com
🔑 test123
👤 Sarah Williams
📱 9876543213
✅ Status: Not Enrolled
```

### Enrolled Users (2)
Test unenrolling or viewing these users:

```
📧 jane@example.com
🔑 test123
👤 Jane Smith
📱 9876543211
✅ Status: Enrolled (Nov 1, 2024)
```

```
📧 mike@example.com
🔑 test123
👤 Mike Johnson
📱 9876543212
✅ Status: Enrolled (Oct 15, 2024)
```

## 🔧 Admin Panel Features to Test

### 1. Login as Admin
1. Go to: http://localhost:3000/login
2. Use: `testadmin@gammaprep.com` / `admin123`
3. After login, you should see "Admin" in navbar
4. Click "Admin" → Goes to admin panel

### 2. View Dashboard Statistics
**Location:** Admin Panel → Top Cards

**What to Check:**
- ✅ Total Users: Should show 5+ users
- ✅ Enrolled Users: Should show 2+ users
- ✅ Successful Payments: Check count
- ✅ Total Revenue: Check amount

### 3. Users Management Tab
**Location:** Admin Panel → "Users Management" tab

**Actions to Test:**

#### A. View All Users
- ✅ List shows all registered users
- ✅ Shows name, email, phone, status
- ✅ Enrolled status shows green badge
- ✅ Not enrolled shows red badge

#### B. Enroll a User Manually
1. Find **John Doe** (not enrolled)
2. Click **"Enroll"** button
3. ✅ Status should change to "Enrolled"
4. ✅ Success message appears
5. ✅ Button changes to "Unenroll"

**Verify:**
- Login as john@example.com
- Go to dashboard
- Should show "Enrolled" status

#### C. Unenroll a User
1. Find **Jane Smith** (enrolled)
2. Click **"Unenroll"** button
3. ✅ Status changes to "Not Enrolled"
4. ✅ Success message appears
5. ✅ Button changes to "Enroll"

**Verify:**
- Login as jane@example.com
- Go to dashboard
- Should show "Not Enrolled" with payment option

#### D. Delete a User
1. Find **Sarah Williams**
2. Click **"Delete"** button
3. ✅ Confirmation popup appears
4. ✅ Click OK
5. ✅ User removed from list
6. ✅ Success message appears

**Verify:**
- Try to login as sarah@example.com
- Should fail (user doesn't exist)

### 4. Payment History Tab
**Location:** Admin Panel → "Payment History" tab

**What to Check:**
- ✅ Shows all payment transactions
- ✅ Displays order ID, user details
- ✅ Shows amount, status, payment method
- ✅ Shows date and time
- ✅ Status badges (SUCCESS/FAILED/PENDING) have colors
- ✅ Can see which user made which payment

**Test Actions:**
1. Make a test payment as one of the test users
2. Refresh admin panel
3. ✅ New payment should appear in history

### 5. Course Settings Tab
**Location:** Admin Panel → "Course Settings" tab

#### A. Update Course Price
1. Current price: ₹15,000
2. Change to: ₹20,000
3. Click **"Update Price"**
4. ✅ Success message appears

**Verify:**
- Logout and go to homepage
- Price should show as ₹23,600 (₹20,000 + 18% GST)

#### B. Update Course Start Date
1. Current date: (check current value)
2. Change to: December 15, 2024
3. Click **"Update Start Date"**
4. ✅ Success message appears

**Verify:**
- Logout and go to homepage
- Hero section should show new start date

## 🧪 Complete Admin Testing Checklist

### Statistics Dashboard
- [ ] View total users count
- [ ] View enrolled users count
- [ ] View successful payments count
- [ ] View total revenue
- [ ] All numbers are accurate

### User Management
- [ ] View all users in table
- [ ] See user details (name, email, phone, status)
- [ ] Enroll a user manually
- [ ] Verify user can see enrolled status
- [ ] Unenroll an enrolled user
- [ ] Verify user loses access
- [ ] Delete a user
- [ ] Confirm user is removed from system
- [ ] Try to login as deleted user (should fail)

### Payment History
- [ ] View all payment transactions
- [ ] See order IDs
- [ ] See user information for each payment
- [ ] See payment amounts
- [ ] See payment status (SUCCESS/FAILED/PENDING)
- [ ] See payment methods
- [ ] See dates and times
- [ ] Status badges show correct colors
- [ ] Can identify which payments are successful

### Course Settings
- [ ] Update course price
- [ ] Verify new price shows on homepage
- [ ] Verify GST is calculated on new price
- [ ] Update course start date
- [ ] Verify new date shows on homepage
- [ ] Settings persist after page refresh

### Navigation & UI
- [ ] Admin link visible only for admin users
- [ ] Non-admin users cannot access /admin
- [ ] Tab switching works smoothly
- [ ] All buttons work correctly
- [ ] Success messages appear
- [ ] Error handling works
- [ ] Mobile responsive design

## 🔐 Security Testing

### Access Control
- [ ] Try accessing /admin without login → Redirects to home
- [ ] Login as regular user → No "Admin" link in navbar
- [ ] Try accessing /admin as regular user → Redirected
- [ ] Login as admin → "Admin" link appears
- [ ] Admin can access all admin features

## 📊 Data Validation

### Statistics Accuracy
1. Count users manually in database
2. Compare with admin panel count
3. ✅ Should match

### Enrollment Changes
1. Enroll a user via admin
2. Check MongoDB → `isEnrolled: true`
3. Check user dashboard → Shows enrolled
4. ✅ All should match

### Payment Records
1. Make a test payment
2. Check admin panel → Should appear
3. Check MongoDB payments collection
4. ✅ Data should match

## 🐛 Known Issues to Watch For

1. **Refresh after changes:** You might need to refresh the admin panel to see updates
2. **Statistics update:** Stats might need page reload to reflect latest changes
3. **Delete confirmation:** Make sure confirmation dialog appears before deletion

## 🎓 Best Practices for Testing

1. **Test with multiple users:** Login as different users to see their perspectives
2. **Verify both sides:** Check admin panel AND user dashboard after changes
3. **Check database:** Use MongoDB Compass to verify data changes
4. **Test edge cases:** Try enrolling already enrolled users, etc.
5. **Check error messages:** Try invalid operations to see error handling

## 🚀 Quick Test Flow

```
1. Login as admin (testadmin@gammaprep.com / admin123)
   ↓
2. View statistics → Check all numbers
   ↓
3. Go to Users Management
   ↓
4. Enroll John Doe
   ↓
5. Verify by logging in as john@example.com
   ↓
6. Go to Payment History tab
   ↓
7. Check if any payments exist
   ↓
8. Go to Course Settings tab
   ↓
9. Update price to ₹20,000
   ↓
10. Logout and check homepage (should show new price)
```

## 📱 Admin Panel URLs

- **Admin Panel:** http://localhost:3000/admin
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Homepage:** http://localhost:3000

## 🆘 Troubleshooting

### Can't see Admin link after login?
- Make sure you're using admin credentials
- Logout and login again
- Check backend console for errors

### Statistics showing zero?
- Make sure MongoDB is running
- Check if users exist in database
- Refresh the page

### Enrollment button not working?
- Check backend console for errors
- Make sure backend is running on port 5000
- Check network tab in browser dev tools

### Changes not reflecting?
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Check if backend saved the changes

---

**Ready to test! Start with logging in as admin and exploring all features.** 🎉

**Admin Login:** http://localhost:3000/login
- Email: `testadmin@gammaprep.com`
- Password: `admin123`



