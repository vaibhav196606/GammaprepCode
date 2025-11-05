# 🔒 Security Checklist - Pre-Deployment

Before pushing to GitHub and deploying, verify all items below:

---

## ✅ Environment Variables Security

### Files to Check:

- [ ] `backend/.env` - Contains actual secrets (NOT committed to git)
- [ ] `backend/.env.example` - Only has placeholders (safe to commit)
- [ ] `.gitignore` - Includes `.env` and `backend/.env`

### Verify No Hardcoded Secrets:

Run these checks before committing:

```bash
# Check if .env is tracked by git (should return nothing)
git ls-files backend/.env

# Search for potential secrets in tracked files
git ls-files | xargs grep -l "mongodb+srv://.*:.*@"
git ls-files | xargs grep -l "gammaprep_db"
```

If any files are found, remove the secrets and add to `.gitignore`.

---

## 🔐 Required Environment Variables

### Development (.env):
```env
MONGODB_URI=mongodb+srv://gammaprep_db:YOUR_PASSWORD@...
JWT_SECRET=your_dev_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CASHFREE_APP_ID=sandbox_id
CASHFREE_SECRET_KEY=sandbox_secret
```

### Production (Railway):
```env
MONGODB_URI=mongodb+srv://gammaprep_db:YOUR_PASSWORD@...
JWT_SECRET=STRONG_RANDOM_32+_CHARS
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
CASHFREE_APP_ID=production_id
CASHFREE_SECRET_KEY=production_secret
```

---

## 📝 Files Safe to Commit

### ✅ Safe (No Secrets):
- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `backend/README.md`
- `SETUP_GUIDE.md`
- `MONGODB_ATLAS_SETUP.md`
- All `.js` files (if using env variables)
- `.gitignore`
- `package.json`
- `railway.json`
- `vercel.json`

### ❌ Never Commit:
- `backend/.env`
- `.env.local`
- `.env.production`
- Any file with actual passwords/keys

---

## 🔍 Code Audit Results

### Files Checked:
- ✅ `README.md` - Cleaned (no real credentials)
- ✅ `backend/README.md` - Only placeholders
- ✅ `backend/server.js` - Uses `process.env.*`
- ✅ `backend/routes/*.js` - Uses `process.env.*`
- ✅ `backend/config/cashfree.js` - Uses `process.env.*`

### Hardcoded Values Found:
None! All sensitive values are in `.env` files.

---

## 🛡️ Security Best Practices

### Before GitHub Push:

1. **Never commit `.env` files**
   ```bash
   # Verify .env is ignored
   git status
   # Should NOT show backend/.env
   ```

2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Random mix of letters, numbers, symbols
   - Different for dev and production

3. **MongoDB password encoding**
   - If password has special chars, URL encode them
   - Example: `Pass@123` → `Pass%40123`

### After Deployment:

4. **Change default credentials**
   - Update JWT_SECRET to production value
   - Use production Cashfree credentials
   - Generate new MongoDB user for production

5. **IP Whitelist**
   - In MongoDB Atlas, restrict IPs
   - Add Railway's IP addresses
   - Remove 0.0.0.0/0 in production

6. **Enable HTTPS**
   - Railway provides HTTPS automatically ✓
   - Vercel provides HTTPS automatically ✓

7. **Monitor logs**
   - Check Railway logs regularly
   - Set up alerts for errors
   - Monitor MongoDB Atlas for unusual activity

---

## 🚨 What to Do if Secrets are Exposed

If you accidentally commit secrets to GitHub:

### Immediate Actions:

1. **Rotate ALL secrets:**
   ```bash
   # Generate new JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Change MongoDB password in Atlas
   # Get new Cashfree credentials
   ```

2. **Remove from Git history:**
   ```bash
   # Remove sensitive file from history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   ```

3. **Update all deployed apps** with new secrets

4. **Check GitHub Security Alerts**
   - Go to repo → Settings → Security → Secret scanning

---

## ✅ Pre-Commit Checklist

Before every `git push`:

```bash
# 1. Check git status
git status
# Ensure backend/.env is NOT listed

# 2. Check what will be committed
git diff --cached

# 3. Search for potential secrets
grep -r "mongodb+srv://gammaprep" --exclude-dir=node_modules --exclude-dir=.git .
# Should only find .env files (which are gitignored)

# 4. Verify .gitignore
cat .gitignore | grep ".env"
# Should show .env patterns
```

---

## 🎯 Deployment Security Checklist

### Railway (Backend):
- [ ] All environment variables set
- [ ] `NODE_ENV=production`
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Production Cashfree credentials
- [ ] FRONTEND_URL points to Vercel

### Vercel (Frontend):
- [ ] API URLs point to Railway
- [ ] No hardcoded localhost URLs
- [ ] CORS configured for Vercel domain

### MongoDB Atlas:
- [ ] Strong password
- [ ] IP whitelist configured
- [ ] Automated backups enabled
- [ ] Connection monitoring enabled

---

## 📊 Post-Deployment Monitoring

### Weekly Tasks:
- [ ] Check Railway logs for errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Review Vercel analytics
- [ ] Check for failed payments

### Monthly Tasks:
- [ ] Review security alerts
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review access logs

---

## 🔗 Security Resources

- **Railway Security:** https://docs.railway.app/reference/security
- **Vercel Security:** https://vercel.com/docs/concepts/security
- **MongoDB Security:** https://www.mongodb.com/docs/manual/security/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

---

## ✅ Final Verification

Before deployment, confirm:

```bash
# Run this command to verify no secrets in git
git ls-files | xargs grep -i "password\|secret\|key" | grep -v "your_\|placeholder\|example"
```

If this returns any results with real values, **DO NOT PUSH** until fixed.

---

**All checks passed? You're ready to deploy! 🚀**

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment steps.

