# 📧 Email Service Setup Guide

This guide will help you set up email notifications for student enrollments using your Outlook email.

---

## 🔑 Step 1: Generate Outlook App Password

Since you're using **info@gammaprep.com** (Outlook/Office365), you need to create an App Password for security.

### For Outlook.com / Hotmail:

1. Go to **Microsoft Account Security**: https://account.microsoft.com/security
2. Click on **"Advanced security options"**
3. Under **"App passwords"**, click **"Create a new app password"**
4. Copy the generated password (it will look like: `xxxx-xxxx-xxxx-xxxx`)
5. Use this password in your Railway environment variables

### For Office 365 / Microsoft 365 Business:

1. Go to **Microsoft 365 Admin Center**: https://admin.microsoft.com/
2. Navigate to **Users → Active users**
3. Select your user (info@gammaprep.com)
4. Under **Mail settings**, enable **App passwords**
5. Generate a new app password
6. Copy the password for use in Railway

---

## ⚙️ Step 2: Add Environment Variables to Railway

1. Go to your **Railway Dashboard**: https://railway.app/
2. Click on your **backend project**
3. Go to **"Variables"** tab
4. Add these **two new variables**:

```
EMAIL_USER=info@gammaprep.com
EMAIL_PASSWORD=your_app_password_here
```

**Important:**
- Use the **App Password** you generated (NOT your regular email password)
- The app password should be 16 characters without spaces
- Railway will automatically redeploy after adding variables

---

## 📧 Step 3: Email Features

### What emails are sent?

#### 1. **Student Enrollment Email** (to student)
- Sent automatically when payment is successful
- Includes:
  - Welcome message
  - Payment details (Order ID, Amount, Transaction ID)
  - What's next steps
  - Course details
  - Contact information

#### 2. **Admin Notification Email** (to you)
- Sent to `info@gammaprep.com`
- Notifies you of new enrollments
- Includes:
  - Student name and email
  - Payment details
  - Enrollment date

---

## 🧪 Step 4: Test the Email Service

After Railway redeploys with new environment variables:

1. Make a test payment on your deployed site
2. Complete the payment successfully
3. Check both:
   - Student email inbox (should receive welcome email)
   - Your inbox (info@gammaprep.com - should receive notification)

---

## 🔍 Step 5: Troubleshooting

### Email not sending?

**Check Railway Logs:**
1. Go to Railway → Your backend project
2. Click **"Deployments"** → Latest deployment
3. Click **"View Logs"**
4. Look for:
   - ✅ `Enrollment email sent to: student@email.com`
   - ✅ `Admin notification sent`
   - ❌ `Error sending enrollment email:` (if there's an error)

### Common Issues:

#### Issue 1: "Invalid login"
- **Cause:** Using regular password instead of app password
- **Fix:** Generate and use an App Password from Microsoft Account

#### Issue 2: "Username and Password not accepted"
- **Cause:** Two-factor authentication might be required
- **Fix:** Enable 2FA on your Microsoft account, then generate app password

#### Issue 3: "Connection timeout"
- **Cause:** Firewall or network restrictions
- **Fix:** Railway should handle this automatically, but check if Outlook SMTP is accessible

---

## 📝 Environment Variables Summary

Add these to **Railway backend project**:

| Variable | Value | Notes |
|----------|-------|-------|
| `EMAIL_USER` | `info@gammaprep.com` | Your Outlook email |
| `EMAIL_PASSWORD` | `xxxx-xxxx-xxxx-xxxx` | App password (NOT regular password) |

---

## 🎨 Customizing Email Templates

Email templates are in: `backend/services/emailService.js`

You can customize:
- Email subject lines
- Email content and styling
- Colors and branding
- What information to include

Just edit the HTML in the `sendEnrollmentEmail` function.

---

## 🔒 Security Best Practices

1. ✅ **Use App Passwords** - Never use your main email password
2. ✅ **Environment Variables** - Never commit passwords to git
3. ✅ **Railway Variables** - Securely stored and encrypted
4. ✅ **HTTPS/TLS** - All emails sent over secure connection

---

## 📊 Monitoring

You can monitor email delivery in:
- **Railway Logs** - See when emails are sent
- **Outlook Sent Items** - Verify emails went out
- **Test with your own email** - Enroll with your email to test

---

## ✅ Quick Checklist

Before going live:

- [ ] Generated Outlook App Password
- [ ] Added `EMAIL_USER` to Railway variables
- [ ] Added `EMAIL_PASSWORD` to Railway variables
- [ ] Railway redeployed successfully
- [ ] Tested enrollment with real payment
- [ ] Received welcome email
- [ ] Received admin notification

---

## 🆘 Need Help?

If emails still aren't working:

1. Check Railway logs for error messages
2. Verify app password is correct
3. Try generating a new app password
4. Ensure 2FA is enabled on Microsoft account
5. Contact Microsoft support if account issues persist

---

**Email service is now ready!** 🎉

Every successful enrollment will automatically send:
- 📧 Welcome email to student
- 🔔 Notification to admin (you)

