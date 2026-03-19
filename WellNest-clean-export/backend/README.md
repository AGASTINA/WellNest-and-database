# WellNest Backend API

Spring Boot REST API for the WellNest wellness platform with user authentication and OTP-based password reset.

## 🔧 Technology Stack

- Spring Boot 3.2
- Spring Data JPA (Hibernate)
- Spring Security
- MySQL Database
- JWT Authentication
- JavaMailSender
- BCrypt Password Hashing
- Lombok

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- MySQL Server running

### Database Setup

1. Create MySQL database (auto-created if configured):
```sql
CREATE DATABASE wellnest_db;
```

2. Update `application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Email Configuration

Configure Gmail SMTP in `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App Passwords
3. Use the 16-character app password

### Run the Application

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Forgot Password (Request OTP)
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

## 📦 Project Structure

```
src/main/java/com/wellnest/
├── config/
│   └── SecurityConfig.java          # Spring Security configuration
├── controller/
│   └── AuthController.java          # REST API endpoints
├── dto/
│   ├── RegisterRequest.java         # Registration DTO
│   ├── LoginRequest.java            # Login DTO
│   ├── ForgotPasswordRequest.java   # Forgot password DTO
│   ├── VerifyOtpRequest.java        # OTP verification DTO
│   ├── ResetPasswordRequest.java    # Password reset DTO
│   ├── AuthResponse.java            # Auth response DTO
│   ├── MessageResponse.java         # Message response DTO
│   └── UserDto.java                 # User DTO
├── entity/
│   └── User.java                    # User JPA entity
├── exception/
│   └── GlobalExceptionHandler.java  # Global exception handling
├── repository/
│   └── UserRepository.java          # JPA repository
├── service/
│   ├── AuthService.java             # Authentication business logic
│   ├── EmailService.java            # Email sending service
│   └── JwtService.java              # JWT token service
└── WellNestApplication.java         # Main application class
```

## 🗄️ Database Entity

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    private Long id;
    private String name;
    private String email;       // Unique
    private String password;    // BCrypt encrypted
    private String otp;         // 6-digit OTP
    private LocalDateTime otpExpiryTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

## 🔒 Security Features

### Password Security
- BCrypt hashing with salt
- Minimum 8 characters validation
- Password strength requirements

### JWT Authentication
- HS512 algorithm
- 24-hour token expiration
- Secure token generation

### OTP Security
- 6-digit random OTP
- 10-minute expiration
- Single-use verification
- Email delivery

### CORS Configuration
- Configured for `http://localhost:3000`
- Allows credentials
- All HTTP methods supported

## ⚙️ Configuration

### application.properties

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/wellnest_db
spring.datasource.username=root
spring.datasource.password=root

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# OTP
otp.expiration.minutes=10
```

## 🧪 Testing

Run tests:
```bash
mvn test
```

## 📝 Error Handling

Global exception handler provides:
- Validation error messages
- Runtime exception handling
- HTTP status codes
- JSON error responses

## 🔄 Future Enhancements

- Refresh token mechanism
- Social login (OAuth2)
- Email verification on registration
- Rate limiting for API endpoints
- Redis caching for tokens
- Swagger API documentation

## 📚 Dependencies

Major dependencies in `pom.xml`:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-mail
- mysql-connector-j
- jjwt (JWT library)
- lombok

---

Built with Spring Boot for enterprise-grade authentication
