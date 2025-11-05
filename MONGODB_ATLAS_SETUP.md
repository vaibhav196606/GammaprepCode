# MongoDB Atlas Connection Guide

## Your Connection String Format

Replace the values in your `backend/.env` file:

```env
# Replace this line in backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gammaprep?retryWrites=true&w=majority

# Example (with actual values):
# MONGODB_URI=mongodb+srv://gammaprep_user:YourPassword123@cluster0.abc12.mongodb.net/gammaprep?retryWrites=true&w=majority
```

## Important Notes

1. **Replace placeholders:**
   - `<username>` → Your database username (e.g., `gammaprep_user`)
   - `<password>` → Your database password (URL encode if it contains special characters)
   - `cluster0.xxxxx` → Your actual cluster address from Atlas
   - Add `/gammaprep` before the `?` to specify the database name

2. **Special Characters in Password:**
   If your password contains special characters, you need to URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `:` → `%3A`
   - `/` → `%2F`
   
   Example: If password is `Pass@123`, use `Pass%40123`

3. **Database Name:**
   Add `/gammaprep` (or any name you prefer) after the cluster address to create/use that specific database.

## Testing the Connection

After updating your `.env` file, restart your backend server:

```bash
# Stop the current backend (Ctrl+C)
cd backend
node server.js
```

You should see:
```
✅ MongoDB Connected
Server running on port 5000
```

## Troubleshooting

### Error: "MongoNetworkError: connection timed out"
- Check if your IP is whitelisted in MongoDB Atlas Network Access
- Make sure you selected "Allow access from anywhere" (0.0.0.0/0)

### Error: "Authentication failed"
- Double-check your username and password
- Make sure special characters in password are URL encoded
- Verify the user has "Read and write to any database" privileges

### Error: "Server selection timed out"
- Check your internet connection
- Verify the cluster is active (not paused)
- Check if MongoDB Atlas is having issues (status.mongodb.com)

## After Successful Connection

Once connected, you can:

1. **View your data in Atlas:**
   - Go to Database → Browse Collections
   - You'll see collections created by your app (users, courses, payments, etc.)

2. **Monitor performance:**
   - Check metrics in the Atlas dashboard
   - View real-time operations

3. **Create backups (recommended):**
   - Free tier includes automated backups
   - You can also create manual snapshots

## Migration from Local MongoDB

If you had data in your local MongoDB, you'll need to:

1. Re-run the admin creation script:
```bash
cd backend
node scripts/create-admin.js
```

2. Re-configure course settings in the admin panel

3. Users will need to register again (or you can export/import data)

## Security Best Practices

1. **Use strong passwords** for database users
2. **Limit IP access** in production (don't use 0.0.0.0/0)
3. **Never commit** your `.env` file to Git
4. **Rotate passwords** periodically
5. **Enable MongoDB Atlas alerts** for unusual activity

## Free Tier Limits

MongoDB Atlas Free Tier (M0) includes:
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Automated backups
- ✅ Perfect for development and small projects

For production with more traffic, consider upgrading to M2 or higher.



