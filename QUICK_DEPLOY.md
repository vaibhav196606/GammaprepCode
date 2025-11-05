# ⚡ Quick Deployment Reference

Ultra-fast deployment guide for Gammaprep. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📦 Step 1: Push to GitHub (2 min)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
git push -u origin main
```

---

## 🚂 Step 2: Deploy Backend to Railway (5 min)

1. Go to https://railway.app/ → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. **Settings:**
   - Root Directory: `backend`
   - Start Command: `npm start`

5. **Add Environment Variables:**
```
MONGODB_URI=mongodb+srv://gammaprep_db:YOUR_PASSWORD@cluster0.ijrikm4.mongodb.net/gammaprep?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_secure_jwt_secret_32_chars_minimum
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_API_VERSION=2023-08-01
```

6. **Deploy** and copy your Railway URL

---

## ▲ Step 3: Deploy Frontend to Vercel (5 min)

### A. Update API URLs in Code

Replace `http://localhost:5000` with your Railway URL in these files:
- `frontend/context/AuthContext.js`
- `frontend/pages/index.js`
- `frontend/pages/admin.js`
- `frontend/pages/payment.js`
- `frontend/pages/dashboard.js`
- `frontend/pages/payment/verify.js`

### B. Push Changes

```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

### C. Deploy to Vercel

1. Go to https://vercel.com/ → Sign up with GitHub
2. **New Project** → Import your repository
3. **Configure:**
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
4. **Deploy**

---

## 🔄 Step 4: Final Updates (2 min)

1. Copy your Vercel URL
2. Go back to Railway → Update `FRONTEND_URL` variable
3. Update CORS in `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

4. Push changes:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

---

## ✅ Done! Test Your App

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app/api/health`

**Test:** Register → Login → Dashboard → Payment

---

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Backend 500 error | Check Railway logs & environment variables |
| Frontend can't connect | Verify Railway URL in frontend code |
| CORS error | Add Vercel URL to CORS origins in `backend/server.js` |
| Payment failing | Check Cashfree credentials & whitelist domain |
| DB connection error | Verify MongoDB URI & password encoding |

---

## 💡 Pro Tips

1. **Auto-deployment:** Both platforms redeploy on git push
2. **View logs:** Railway & Vercel dashboards
3. **Free tier limits:**
   - Railway: $5/month credit
   - Vercel: Unlimited bandwidth
   - MongoDB: 512MB storage

---

Total Time: **~15 minutes** 🚀

For detailed guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

