# WellNest Frontend

Modern React.js frontend for the WellNest wellness platform.

## 🎨 Features

- Responsive landing page with hero section
- User authentication (Login, Sign Up, Forgot Password)
- Form validation with error handling
- Modern UI with Tailwind CSS
- Client-side routing with React Router

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

Runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.js      # Home page with hero and features
│   ├── Login.js            # Login form
│   ├── SignUp.js           # Registration form
│   └── ForgotPassword.js   # Password reset flow
├── App.js                   # Main app with routing
├── index.js                 # Entry point
└── index.css                # Tailwind CSS imports
```

## 🎨 Tailwind CSS Configuration

Custom color theme in `tailwind.config.js`:
- Primary colors: Green shades for wellness theme
- Responsive design breakpoints
- Custom utility classes

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:8080/api/auth`

Endpoints used:
- `/register` - User registration
- `/login` - User login
- `/forgot-password` - Request OTP
- `/verify-otp` - Verify OTP
- `/reset-password` - Reset password

## 📱 Pages

### Landing Page
- Hero section with CTA buttons
- Feature cards (6 wellness features)
- Call-to-action section
- Navigation bar

### Authentication Pages
- **Login**: Email/password with validation
- **Sign Up**: Full registration form
- **Forgot Password**: 3-step password reset
  - Step 1: Enter email
  - Step 2: Enter OTP
  - Step 3: Set new password

## 🔒 Form Validation

All forms include:
- Required field validation
- Email format validation
- Password strength validation
- Real-time error messages
- Submit button loading states

## 🎯 Future Enhancements

- Dashboard page
- User profile management
- Wellness tracking features
- Social features (community)

---

Built with React.js and Tailwind CSS
