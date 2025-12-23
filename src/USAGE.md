# Styly App Usage Guide

## How to Use the App

### 1. Welcome Screen
- **Purpose**: App introduction and entry point
- **Features**: 
  - Animated logo with sparkles
  - Gradient background
  - "Let's Go" button → Goes to Signup
  - "Login" button → Goes to Login
  - "Sign up here" link → Goes to Signup

### 2. Login Screen
- **Purpose**: User authentication for existing users
- **Features**:
  - Email and password input fields
  - Password visibility toggle
  - Form validation
  - Loading state during login
  - Link to signup page
  - Back button to welcome screen

### 3. Signup Screen
- **Purpose**: User registration for new users
- **Features**:
  - Email, password, and confirm password fields
  - Password visibility toggles
  - Password matching validation
  - Form validation (6+ character password)
  - Loading state during signup
  - Link to login page
  - Back button to welcome screen

### 4. Camera Prep Screen
- **Purpose**: Prepare user for 3D face scanning
- **Features**:
  - Animated 3D avatar demonstration
  - Rotating instruction visual
  - Step-by-step scanning guidelines
  - User profile display in header
  - Logout functionality
  - "Start Scan" button → Goes to camera

### 5. Camera Screen
- **Purpose**: Simulate 3D face scanning process
- **Features**:
  - Mock camera interface with face guide overlay
  - Progressive scanning animation
  - Real-time instruction updates
  - Progress bar showing scan completion
  - Animated scanning indicators
  - "View Results" button (appears when scan completes)

### 6. Try-On Screen
- **Purpose**: Display and interact with hairstyle options
- **Features**:
  - 3D avatar with applied hairstyles
  - Hairstyle selection carousel
  - Like/favorite functionality
  - Style categories and popularity badges
  - Action buttons (heart, share, download)
  - "Save This Look" button
  - "Try Another Style" button → Goes back to camera prep
  - "Retake" button → Goes back to camera

## Navigation Flow

```
Welcome → Login/Signup → Camera Prep → Camera → Try-On
    ↑         ↑              ↑         ↑        ↑
    ←---------←--------------←---------←--------←
```

## Mock Data

The app includes realistic mock data for:
- User authentication (any email/password works)
- 6 different hairstyle options with categories
- Popularity badges (Trending, Popular, New, Hot, Classic)
- Progressive scanning simulation

## Key Interactions

1. **Authentication**: Any valid email format and password (6+ chars) works
2. **Scanning**: Automatic progress simulation with instruction updates
3. **Style Selection**: Click any hairstyle card to preview it
4. **Favorites**: Click heart icon to like/unlike styles
5. **Logout**: Available from any authenticated screen

## Responsive Design

- Mobile-first approach
- Responsive layouts for all screen sizes
- Touch-friendly interactions
- Smooth animations and transitions

## Animation Features

- Logo entrance animation on welcome screen
- Form transitions and loading states
- 3D avatar rotation demonstrations
- Scanning progress animations
- Style change transitions
- Hover and click micro-interactions