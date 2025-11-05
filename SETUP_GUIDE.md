# Quick Setup Guide - Gammaprep Website

This guide will help you get the Gammaprep website up and running quickly.

## Prerequisites Check

- [ ] Node.js installed (v16+) - Check with `node --version`
- [ ] npm installed - Check with `npm --version`
- [ ] MongoDB installed or MongoDB Atlas account

## Step-by-Step Setup

### 1. Install All Dependencies (5 minutes)

```bash
# From the project root directory
npm run install:all
```

This will install dependencies for the root, backend, and frontend.

### 2. Start MongoDB (2 minutes)

**Option A: Local MongoDB**
```bash
# Windows (as Administrator)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update in backend/.env

### 3. Configure Backend Environment (1 minute)

The backend already has a `.env` file, but verify it exists:

```bash
# backend/.env should contain:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gammaprep
JWT_SECRET=gammaprep_secret_key_2024_change_this_in_production
NODE_ENV=development
```

### 4. Start the Application (1 minute)

```bash
# From project root
npm run dev
```

This starts both frontend and backend:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 5. Create Admin User (2 minutes)

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Register with your email
4. Open MongoDB:
   - **MongoDB Compass**: Connect to `mongodb://localhost:27017`
   - **Or use mongo shell**:
     ```bash
     mongosh
     use gammaprep
     db.users.updateOne(
       { email: "YOUR_EMAIL@example.com" },
       { $set: { isAdmin: true } }
     )
     ```
5. Logout and login again
6. You should now see "Admin" in the navbar

## Verify Everything Works

- [ ] Homepage loads at http://localhost:3000
- [ ] Can register a new user
- [ ] Can login
- [ ] Dashboard shows user info
- [ ] Admin panel accessible (after setting isAdmin: true)
- [ ] Can enroll/unenroll users from admin panel
- [ ] Can update course price and start date

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB service is running
- Check MongoDB URI in backend/.env

### Port Already in Use
- Change PORT in backend/.env to another port (e.g., 5001)
- Update API URLs in frontend files

### Cannot Access Admin Panel
- Make sure you set `isAdmin: true` in MongoDB
- Try logging out and logging in again

### Frontend Can't Connect to Backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify backend URL in frontend files

## Next Steps

1. Customize the website content in `frontend/pages/index.js`
2. Update testimonials
3. Add your own branding
4. Configure email notifications (optional)
5. Set up deployment (see README.md)

## Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints documentation
- Check browser console for errors
- Check backend terminal for error logs

---

Estimated setup time: **10-15 minutes**

