# 🚀 Deployment Guide - Gammaprep

This guide will walk you through deploying your Gammaprep application for **FREE** using:
- **Railway** for Backend (Node.js/Express API)
- **Vercel** for Frontend (Next.js)
- **MongoDB Atlas** for Database (Already configured!)

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Push to GitHub:

1. **All secrets are in `.env` files** ✓
2. **`.gitignore` is properly configured** ✓
3. **README.md has no sensitive data** ✓
4. **MongoDB Atlas is already connected** ✓

---

## 🗂️ Step 1: Push Code to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `gammaprep-bootcamp`)
3. **DO NOT** initialize with README (you already have one)

### 1.3 Push Your Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/gammaprep-bootcamp.git
git branch -M main
git push -u origin main
```

✅ **Verify:** All your code is now on GitHub. The `.env` file should NOT be visible in your repository.

---

## 🚂 Step 2: Deploy Backend to Railway

Railway offers **$5 free credits per month** and is perfect for Node.js apps.

### 2.1 Sign Up for Railway

1. Go to https://railway.app/
2. Click **"Start a New Project"**
3. Sign up with GitHub (easiest option)

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account if prompted
4. Select your `gammaprep-bootcamp` repository

### 2.3 Configure Railway Project

1. Railway will detect it's a Node.js project
2. Click on your deployed service
3. Go to **"Settings"** tab
4. Set the following:

**Root Directory:**
```
backend
```

**Start Command:**
```
npm start
```

**Build Command:**
```
npm install
```

### 2.4 Add Environment Variables

Go to **"Variables"** tab and add ALL of these:

```
MONGODB_URI=mongodb+srv://gammaprep_db:YOUR_PASSWORD@cluster0.ijrikm4.mongodb.net/gammaprep?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE

PORT=5000

NODE_ENV=production

FRONTEND_URL=https://your-app-name.vercel.app

CASHFREE_APP_ID=YOUR_CASHFREE_APP_ID

CASHFREE_SECRET_KEY=YOUR_CASHFREE_SECRET_KEY

CASHFREE_API_VERSION=2023-08-01
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual MongoDB password
- Replace `YOUR_SECURE_JWT_SECRET_HERE` with a strong random string
- Replace Cashfree credentials with your actual values
- You'll update `FRONTEND_URL` after deploying frontend

### 2.5 Deploy!

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Railway will provide you a URL like: `https://your-app.up.railway.app`

### 2.6 Test Your Backend

Visit: `https://your-app.up.railway.app/api/health`

You should see: `{"status":"Server is running"}`

✅ **Copy your Railway backend URL** - you'll need it for the frontend!

---

## ▲ Step 3: Deploy Frontend to Vercel

Vercel is the **FREE** hosting platform made by the creators of Next.js.

### 3.1 Update API URLs in Frontend Code

Before deploying, you need to update the hardcoded API URLs.

**Option A: Use Environment Variables (Recommended)**

1. Create `frontend/.env.local` (for local testing):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

2. Update your frontend code to use the env variable:

In `frontend/context/AuthContext.js`, `frontend/pages/index.js`, `frontend/pages/admin.js`, etc.:

Replace all instances of:
```javascript
'http://localhost:5000/api/...'
```

With:
```javascript
`${process.env.NEXT_PUBLIC_API_URL}/api/...`
```

**Option B: Direct Replacement (Simpler)**

Replace `http://localhost:5000` with your Railway URL in these files:
- `frontend/context/AuthContext.js`
- `frontend/pages/index.js`
- `frontend/pages/admin.js`
- `frontend/pages/payment.js`
- `frontend/pages/dashboard.js`
- `frontend/pages/payment/verify.js`

### 3.2 Commit and Push Changes

```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

### 3.3 Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your `gammaprep-bootcamp` repository
5. Configure:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Install Command:** `npm install`

### 3.4 Add Environment Variables (If using Option A)

In Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

### 3.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel gives you a URL like: `https://gammaprep-bootcamp.vercel.app`

---

## 🔄 Step 4: Final Configuration

### 4.1 Update FRONTEND_URL in Railway

1. Go back to Railway
2. Update the `FRONTEND_URL` variable with your actual Vercel URL
3. Redeploy the backend

### 4.2 Update CORS Origins (Optional but Recommended)

In `backend/server.js`, update CORS to include your production frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://your-app.vercel.app',  // Add your Vercel URL
    'https://gammaprep.com'          // Add custom domain if you have one
  ],
  credentials: true
}));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Railway will auto-deploy the changes!

### 4.3 Update Cashfree Return URL

In Cashfree dashboard, whitelist your Vercel domain for payment redirects.

---

## ✅ Step 5: Test Your Deployed Application

### Test Checklist:

1. ✅ Visit your Vercel URL
2. ✅ Register a new user
3. ✅ Login successfully
4. ✅ View dashboard
5. ✅ Check if MongoDB Atlas has the new user (in Atlas dashboard)
6. ✅ Test payment flow (use Cashfree sandbox test cards)
7. ✅ Login as admin and check admin panel

---

## 🎉 Your App is Live!

### Your Deployment URLs:

- **Frontend (Vercel):** `https://your-app.vercel.app`
- **Backend (Railway):** `https://your-app.up.railway.app`
- **Database:** MongoDB Atlas (Already configured!)

---

## 💰 Cost Breakdown (FREE!)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Railway** | $5/month credit | ~500 hours runtime |
| **Vercel** | Free forever | Unlimited bandwidth (hobby) |
| **MongoDB Atlas** | Free forever | 512MB storage |

**Total Cost:** $0 🎉

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** 500 Internal Server Error
- Check Railway logs: Go to Railway → Your Project → Deployments → View Logs
- Verify all environment variables are set correctly
- Check MongoDB connection string

**Problem:** CORS errors
- Make sure CORS origins include your Vercel URL
- Check `backend/server.js` CORS configuration

### Frontend Issues

**Problem:** Can't connect to backend
- Verify API URL is correct (Railway URL)
- Check if backend is running (visit `/api/health`)
- Check browser console for errors

**Problem:** Payment not working
- Verify Cashfree credentials are production credentials
- Check if `FRONTEND_URL` is set correctly in Railway
- Whitelist your Vercel domain in Cashfree dashboard

### Database Issues

**Problem:** Can't save data
- Check MongoDB Atlas connection string
- Verify password doesn't contain unencoded special characters
- Check if cluster is active (not paused)

---

## 🔒 Security Best Practices

### Post-Deployment Security:

1. **Change JWT Secret:** Use a strong random 32+ character string
2. **MongoDB IP Whitelist:** In Atlas, consider restricting IPs instead of 0.0.0.0/0
3. **Rate Limiting:** Add rate limiting to your API endpoints
4. **HTTPS Only:** Both Vercel and Railway provide HTTPS automatically ✓
5. **Monitor Logs:** Regularly check Railway and Vercel logs for suspicious activity
6. **Backup Database:** Enable automated backups in MongoDB Atlas

---

## 🎯 Optional: Add Custom Domain

### For Frontend (Vercel):

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel project → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### For Backend (Railway):

1. In Railway project → Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 📊 Monitoring & Maintenance

### Railway (Backend):
- View logs in real-time
- Monitor CPU and memory usage
- Set up alerts for downtime

### Vercel (Frontend):
- Analytics built-in
- Performance monitoring
- Deploy previews for each git push

### MongoDB Atlas:
- Performance metrics dashboard
- Real-time alerts
- Automatic backups

---

## 🚀 Auto-Deployment Setup

Both Railway and Vercel support **automatic deployments**:

When you push to GitHub:
1. Railway automatically redeploys backend
2. Vercel automatically redeploys frontend

To trigger deployment:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## 🆘 Need Help?

### Resources:
- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/

### Common Commands:

**View Railway logs:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

**View Vercel logs:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View logs
vercel logs
```

---

## ✨ You're Done!

Your Gammaprep application is now live and accessible to the world! 🌍

Share your deployment URL and start enrolling students! 🎓

---

**Last Updated:** November 2025
**Deployment Time:** ~20-30 minutes total

