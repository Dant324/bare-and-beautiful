# Styly - AI Hairstyle Try-On App

A modern React application that allows users to try on different hairstyles using AI technology. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Welcome Screen**: Animated landing page with smooth transitions
- **Authentication**: Login and signup functionality with form validation
- **Camera Preparation**: Instructions for 3D face scanning
- **Live Camera**: Mock camera interface with scanning progress
- **Style Try-On**: Interactive hairstyle selection with 3D avatar preview

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Components**: Shadcn/ui

## Project Structure

```
├── App.tsx                    # Main application component with routing
├── components/
│   ├── WelcomeScreen.tsx      # Landing page with animated logo
│   ├── LoginScreen.tsx        # User authentication (login)
│   ├── SignupScreen.tsx       # User registration
│   ├── CameraPrepScreen.tsx   # Camera setup instructions
│   ├── CameraScreen.tsx       # Live camera interface
│   ├── TryOnScreen.tsx        # Hairstyle selection and preview
│   └── ui/                    # Shadcn/ui components
├── styles/
│   └── globals.css            # Global styles and design tokens
└── README.md                  # This file
```

## Key Components

### App.tsx
Main component that manages:
- Navigation state between screens
- User authentication state
- Screen transitions

### WelcomeScreen.tsx
- Animated logo with rotating elements
- Gradient backgrounds
- Call-to-action buttons
- Smooth entrance animations

### LoginScreen.tsx / SignupScreen.tsx
- Form validation
- Password visibility toggle
- Loading states
- Error handling

### CameraPrepScreen.tsx
- 3D avatar animation
- Rotating instruction visual
- Preparation guidelines
- User profile display

### CameraScreen.tsx
- Mock camera interface
- Face detection overlay
- Scanning progress indicator
- Real-time feedback

### TryOnScreen.tsx
- 3D avatar display
- Hairstyle carousel
- Like/save functionality
- Style recommendations

## Design System

The app uses a custom design system built on Tailwind CSS v4 with:
- Purple-to-pink gradient color scheme
- Smooth animations and transitions
- Consistent spacing and typography
- Responsive design patterns

## Getting Started

1. The app starts on the Welcome screen
2. Users can login or sign up
3. After authentication, users are guided to camera preparation
4. The camera screen simulates 3D face scanning
5. Results show on the try-on screen with style options

## Mock Data

The app includes mock data for:
- User authentication (no real backend)
- Camera scanning simulation
- Hairstyle options and categories
- User preferences and likes

## Future Enhancements

- Real camera integration
- 3D face model generation
- AI-powered style recommendations
- Social sharing features
- User profile management
- Backend integration with Supabase

## Development Notes

- Uses TypeScript for type safety
- Implements responsive design
- Includes smooth animations throughout
- Follows React best practices
- Uses modern CSS features