# WellNest - Wellness Platform

A modern full-stack wellness platform built with React.js and Spring Boot.

## 🚀 Project Structure

```
WellNest/
├── frontend/          # React.js frontend application
└── backend/           # Spring Boot backend API
```

## 📋 Features

- **User Authentication**: Registration, Login, and Password Reset with OTP
- **Modern UI**: Responsive design with Tailwind CSS
- **Secure Backend**: BCrypt password hashing and JWT authentication
- **Email Integration**: OTP verification via email
- **Database**: MySQL with Hibernate ORM

## 🛠️ Technology Stack

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Fetch API for HTTP requests

### Backend
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT for authentication
- JavaMailSender for email

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- Maven
- MySQL Server

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure MySQL database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wellnest_db?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Configure email settings for OTP:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

4. Build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will run on `http://localhost:8080`

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `application.properties`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request OTP for password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with OTP

## 🎨 Frontend Pages

- **Landing Page** (`/`) - Hero section with features
- **Login** (`/login`) - User login form
- **Sign Up** (`/signup`) - User registration form
- **Forgot Password** (`/forgot-password`) - Password reset with OTP

## 🗄️ Database Schema

### Users Table
- `id` (Long) - Primary key
- `name` (String) - User's full name
- `email` (String) - User's email (unique)
- `password` (String) - Encrypted password
- `otp` (String) - One-time password
- `otp_expiry_time` (DateTime) - OTP expiration timestamp
- `created_at` (DateTime) - Account creation time
- `updated_at` (DateTime) - Last update time

## 🔒 Security Features

- BCrypt password hashing
- JWT token-based authentication
- OTP expiration (10 minutes)
- CORS configuration
- Input validation

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@wellnest.com

---

Built with ❤️ for wellness
