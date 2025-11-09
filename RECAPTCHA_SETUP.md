# Google reCAPTCHA Setup Instructions

## Overview
Google reCAPTCHA has been added to the login and registration pages to prevent bot/spam signups.

## Step 1: Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Fill in the details:
   - **Label**: Gammaprep
   - **reCAPTCHA type**: Select "reCAPTCHA v2" > "I'm not a robot" Checkbox
   - **Domains**: Add your domains:
     - `localhost` (for local development)
     - `gammaprep.com`
     - `www.gammaprep.com`
   - Accept the reCAPTCHA Terms of Service
4. Click "Submit"
5. You'll get two keys:
   - **Site Key** (for frontend)
   - **Secret Key** (for backend)

## Step 2: Configure Frontend (Vercel)

Add the following environment variable in your Vercel project settings:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Important**: The variable must start with `NEXT_PUBLIC_` to be accessible in the browser.

## Step 3: Configure Backend (Railway)

Add the following environment variable in your Railway project settings:

```
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Step 4: For Local Development

### Frontend `.env.local`
Create or update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

### Backend `.env`
Add to `backend/.env`:
```
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Testing

### Test Keys (for development only)
Google provides test keys that always pass verification:

**Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
**Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These are already set as defaults in the code, so the CAPTCHA will work in development even without setting environment variables.

### Production Testing
1. Deploy the changes to Vercel and Railway
2. Add your production reCAPTCHA keys to environment variables
3. Clear your browser cache
4. Try to register/login
5. You should see the reCAPTCHA checkbox
6. After checking the box, the submit button will be enabled

## Features

- ✅ CAPTCHA required on both login and registration pages
- ✅ Submit button is disabled until CAPTCHA is completed
- ✅ CAPTCHA resets on error (user must verify again)
- ✅ Backend verifies the token with Google before allowing signup/login
- ✅ Fallback to test keys for local development

## Security Benefits

1. **Prevents Bot Signups**: Automated scripts cannot bypass the CAPTCHA
2. **Reduces Spam**: Human verification required for all new accounts
3. **Server-side Validation**: Backend double-checks the CAPTCHA token
4. **Failed Login Protection**: Bots cannot brute-force login attempts

## Troubleshooting

### CAPTCHA not showing
- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in Vercel
- Clear browser cache and reload

### CAPTCHA verification failing
- Check that `RECAPTCHA_SECRET_KEY` is set in Railway
- Make sure the domain is registered in reCAPTCHA admin console
- Check backend logs for verification errors

### Button stays disabled
- Make sure you check the CAPTCHA checkbox
- Try refreshing the page
- Check browser console for errors

