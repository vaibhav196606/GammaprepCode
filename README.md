# Gammaprep - Interview Bootcamp Website

A full-stack bootcamp website for SDE/MLE interview preparation, featuring live classes on DSA, System Design (HLD/LLD), and Data Science with Machine Learning.

## 🎯 Features

### Frontend
- **Modern Landing Page** with course information, syllabus, and testimonials
- **User Authentication** (Login/Register)
- **User Dashboard** showing enrollment status and user details
- **Payment Integration** with Cashfree Payment Gateway
- **Admin Panel** for managing users, enrollment, course pricing, and payments
- **Responsive Design** using Tailwind CSS
- **Real-time Updates** for course information

### Backend
- **RESTful API** built with Express.js
- **MongoDB Database** for data persistence
- **JWT Authentication** for secure user sessions
- **Admin Authorization** for protected routes
- **User Management** system
- **Course Management** (pricing and scheduling)
- **Payment Processing** with Cashfree integration
- **Payment History** and transaction tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cashfree PG** - Payment gateway integration
- **CORS** - Cross-Origin Resource Sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GammaprepCode
```

### 2. Install Dependencies

Install all dependencies for root, backend, and frontend:

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file in the backend folder

### 4. Configure Environment Variables

The backend `.env` file is already configured with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gammaprep  # Or use MongoDB Atlas connection string
JWT_SECRET=your_jwt_secret_key_change_this
NODE_ENV=development
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_API_VERSION=2023-08-01
FRONTEND_URL=http://localhost:3000
```

**Note**: Get Cashfree credentials from https://www.cashfree.com/

### 5. Create Default Admin User

After starting the backend server, you'll need to create an admin user manually in MongoDB:

1. Start the backend server
2. Register a new user through the website
3. Open MongoDB (using MongoDB Compass or mongo shell)
4. Find the user in the `users` collection
5. Update the user document to set `isAdmin: true`

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 💳 Payment Testing

### Test Payment in Sandbox Mode

1. Register a new user and login
2. Go to Dashboard
3. Click "Proceed to Payment"
4. Click the "Pay" button
5. Use Cashfree sandbox test credentials:
   - **Test Card**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **OTP**: 123456

For more details, see [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md)

## 📱 Application Routes

### Public Routes
- `/` - Home page with course information
- `/login` - User login
- `/register` - User registration
- `/#syllabus` - Course syllabus section
- `/#testimonials` - Testimonials section

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/payment` - Payment page (requires authentication)
- `/payment/verify` - Payment verification page
- `/admin` - Admin panel (requires admin privileges)

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile (protected)

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/enroll` - Enroll/unenroll user
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/stats` - Get dashboard statistics

### Course
- `GET /api/course` - Get course information (public)
- `PUT /api/course/price` - Update course price (admin only)
- `PUT /api/course/start-date` - Update course start date (admin only)

### Payment
- `POST /api/payment/create-order` - Create payment order (protected)
- `POST /api/payment/verify` - Verify payment (protected)
- `GET /api/payment/status/:orderId` - Get payment status (protected)
- `GET /api/payment/history` - Get payment history (protected)
- `POST /api/payment/webhook` - Cashfree webhook (public)

## 👨‍💼 Admin Panel Features

The admin panel (`/admin`) allows administrators to:

1. **View Statistics**
   - Total Users
   - Enrolled Users
   - Successful Payments
   - Total Revenue

2. **Manage Users**
   - View all registered users
   - Manually enroll or unenroll users
   - Delete users from the system

3. **View Payment History**
   - See all payment transactions
   - Filter by status
   - View user details and transaction IDs

4. **Update Course Settings**
   - Change the bootcamp pricing
   - Set the next batch start date

## 📦 Project Structure

```
GammaprepCode/
├── backend/
│   ├── config/
│   │   └── cashfree.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   ├── course.js
│   │   └── payment.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── Layout.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── admin.js
│   │   ├── payment.js
│   │   ├── payment/
│   │   │   └── verify.js
│   │   ├── _app.js
│   │   └── _document.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── package.json
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
└── PAYMENT_INTEGRATION.md
```

## 🎨 Customization

### Changing Colors
Edit `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#6366f1',    // Change primary color
      secondary: '#8b5cf6',  // Change secondary color
    },
  },
}
```

### Updating Course Syllabus
Edit the syllabus array in `frontend/pages/index.js`

### Modifying Testimonials
Testimonials are fetched from https://gammaprep.com/Testimonials. You can also hardcode them in `frontend/pages/index.js`

## 🔒 Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` to a strong, random string in production
2. **Update Payment Credentials**: Replace sandbox Cashfree credentials with production keys
3. **Environment Variables**: Never commit `.env` files to version control
4. **HTTPS**: Use HTTPS in production for all payment pages
5. **Password Policy**: Minimum 6 characters (can be enhanced)
6. **Rate Limiting**: Consider adding rate limiting for API endpoints in production
7. **Webhook Verification**: Implement Cashfree webhook signature verification

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update MongoDB URI to production database
3. Update Cashfree credentials to production keys
4. Set `NODE_ENV=production`
5. Deploy backend code
6. Note the backend URL

### Frontend Deployment (Vercel/Netlify)

1. Update API URLs in frontend code to point to production backend
2. Deploy frontend code
3. Configure environment variables if needed

### Update API URLs

Replace `http://localhost:5000` with your production backend URL in:
- `frontend/context/AuthContext.js`
- `frontend/pages/index.js`
- `frontend/pages/admin.js`
- `frontend/pages/payment.js`
- `frontend/pages/payment/verify.js`

## 📧 Contact

For queries, contact: info@gammaprep.com

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Mentor**: Vaibhav Goyal (SDE2 at Microsoft, Ex-SDE at Oracle)
- **Logo**: https://gammaprep.com/assets/images/Gamma_Logo.svg
- **Payment Gateway**: Cashfree Payments

---

Built with ❤️ for aspiring SDE/MLE professionals
