# Troubleshooting Guide - Gammaprep Website

## Registration/Server Error

If you're getting a server error when trying to create an account, follow these steps:

### Step 1: Check if Backend Server is Running

1. Open a terminal/command prompt
2. Navigate to the project folder
3. Run:
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

**If you DON'T see this**, continue to Step 2.

### Step 2: Check MongoDB Connection

#### For Windows Users:

1. **Check if MongoDB is installed:**
```bash
mongod --version
```

2. **Check if MongoDB service is running:**
```bash
sc query MongoDB
```

3. **If not running, start it (as Administrator):**
```bash
net start MongoDB
```

#### For macOS/Linux Users:

1. **Check if MongoDB is running:**
```bash
sudo systemctl status mongod
```

2. **If not running, start it:**
```bash
sudo systemctl start mongod
```

### Step 3: Alternative - Use MongoDB Atlas (Cloud)

If local MongoDB doesn't work, use MongoDB Atlas (free):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gammaprep?retryWrites=true&w=majority
```
(Replace username and password with your MongoDB Atlas credentials)

7. Restart the backend server

### Step 4: Check Port Conflicts

If port 5000 is already in use:

1. Edit `backend/.env`:
```
PORT=5001
```

2. Update API URLs in frontend:
   - `frontend/context/AuthContext.js` - Change all `http://localhost:5000` to `http://localhost:5001`
   - `frontend/pages/index.js` - Change `http://localhost:5000` to `http://localhost:5001`
   - `frontend/pages/admin.js` - Change `http://localhost:5000` to `http://localhost:5001`

### Step 5: Check Dependencies

Make sure all dependencies are installed:

```bash
# From project root
cd backend
npm install

cd ../frontend
npm install
```

### Step 6: Test Backend Connection

With backend running, open a browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"Server is running"}
```

If you see this, the backend is working!

### Step 7: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try registering again
4. Look for error messages

Common errors:
- **ERR_CONNECTION_REFUSED**: Backend is not running
- **ERR_NETWORK**: CORS issue or backend not accessible
- **400/500 errors**: Check backend terminal for detailed error

## Common Error Messages and Solutions

### "Cannot connect to server"
- **Solution**: Make sure backend is running on port 5000
- Run: `cd backend && npm run dev`

### "MongoDB connection error"
- **Solution**: Start MongoDB service or use MongoDB Atlas
- Windows: `net start MongoDB` (as admin)
- Mac/Linux: `sudo systemctl start mongod`

### "User already exists"
- **Solution**: This email is already registered
- Try logging in instead or use a different email

### "Password must be at least 6 characters"
- **Solution**: Use a longer password (minimum 6 characters)

### Port already in use
- **Solution**: Another app is using port 5000 or 3000
- Change ports in `.env` files

## Quick Diagnosis Script

Run this in your terminal from the project root:

```bash
# Check if backend dependencies exist
dir backend\node_modules

# Check if frontend dependencies exist  
dir frontend\node_modules

# Check MongoDB status
sc query MongoDB

# Test backend port
curl http://localhost:5000/api/health
```

## Still Having Issues?

### Create a detailed bug report:

1. **What error message do you see?**
   - Screenshot the browser error
   - Copy backend terminal error

2. **Check backend terminal output**
   - What does it say when you start the server?

3. **Check browser console (F12)**
   - Are there any red error messages?

4. **System info:**
   - Operating System: _______
   - Node version: `node --version`
   - npm version: `npm --version`
   - MongoDB installed: Yes/No

## Manual Testing

### Test Backend API Manually:

Using PowerShell or curl:

```powershell
# Test registration (replace with your data)
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Or use Postman:
1. Install Postman
2. POST to `http://localhost:5000/api/auth/register`
3. Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## Clean Install

If nothing works, try a clean install:

```bash
# Delete node_modules
rd /s /q node_modules
rd /s /q backend\node_modules
rd /s /q frontend\node_modules

# Delete package-lock files
del package-lock.json
del backend\package-lock.json
del frontend\package-lock.json

# Reinstall
npm run install:all
```

## Need More Help?

Share this information:
1. Backend terminal output (full)
2. Browser console errors (screenshot)
3. MongoDB status
4. Steps you've already tried

