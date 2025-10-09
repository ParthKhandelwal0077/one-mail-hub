# Authentication System

This project implements a complete authentication system with the following features:

## Features

### 🔐 Authentication
- **Phone Number Registration**: Users register with phone number and password
- **Login/Logout**: Secure login with automatic token management
- **Password Validation**: Enforces strong password requirements
- **Phone Number Validation**: Validates international phone number format

### 🛡️ Security
- **JWT Token Management**: Automatic access and refresh token handling
- **Token Refresh**: Seamless token refresh when access token expires
- **Protected Routes**: Route protection with automatic redirects
- **Secure Storage**: Tokens stored securely in localStorage

### 👤 User Management
- **Profile Display**: Shows user profile information in dashboard
- **Account Statistics**: Displays user email statistics
- **Profile Updates**: Support for updating user profile information
- **Account Management**: Change password and delete account functionality

## API Endpoints Used

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `POST /api/user/refresh` - Token refresh

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password
- `DELETE /api/user/account` - Delete account
- `GET /api/user/verify` - Verify token
- `GET /api/user/stats` - Get user statistics

## Components

### Core Components
- `AuthProvider` - Authentication context provider
- `ProtectedRoute` - Route protection wrapper
- `AuthService` - API service for authentication
- `UserProfileCard` - User profile display component

### Pages
- `Auth.tsx` - Login/Register page
- `Dashboard.tsx` - Protected dashboard with profile tab

## Usage

### Authentication Flow
1. User visits `/auth` page
2. Enters phone number and password
3. System validates credentials
4. On success, tokens are stored and user is redirected to dashboard
5. Dashboard shows user profile and statistics

### Token Management
- Access tokens are automatically added to API requests
- Refresh tokens are used to get new access tokens
- Expired tokens trigger automatic refresh
- Failed refresh redirects to login page

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

### Phone Number Format
- Supports international format: `+1234567890`
- Supports local format: `1234567890`
- Must be unique across all users

## Error Handling
- Comprehensive error handling for all API calls
- User-friendly error messages
- Automatic retry for failed requests
- Graceful fallback for network issues
