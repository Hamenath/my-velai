# MY VELAI (என் வேலை)

> **Madurai Local Jobs & Services Marketplace**  
> Direct connection between Madurai customers and skilled workers for daily-wage, part-time, and home services.

## Brand Identity & Design System
- **Brand Yellow**: `#FACC15`
- **Brand Black**: `#171717`
- **Primary Background**: `#FFFFFF`
- **Secondary Background**: `#F8F8F6`
- **Borders**: `#EAEAEA`
- **Success**: `#16803D`
- **Error / Urgent**: `#DC2626`

## Features
- **Tamil-First Experience**: Built with authentic Tamil localization (`ta`) and English (`en`) support with instant toggle.
- **Madurai Localities**: Mattuthavani, Goripalayam, Simmakkal, Anna Nagar, KK Nagar, Arappalayam, Periyar, Teppakulam, Sellur, Villapuram.
- **Customer Mode**:
  - Service categories discovery (Electrician, Plumber, Daily Wage, Painter, Cleaner, etc.)
  - Post a Job flow with multi-field validation
  - Nearby verified workers with direct calling and booking
  - Live Booking Tracker with 4-step stepper and service-start OTP
- **Worker Mode**:
  - Live availability toggle (Available / Busy)
  - Job search & filters (Daily wage, Urgent, Part-time)
  - Interactive application modal with custom wage quote
  - Recorded earnings breakdown & upcoming work schedule
- **Seamless Role Switching**: One-tap toggle between Customer and Worker modes anytime.

## Tech Stack
- **Framework**: Expo SDK 57 (React Native 0.86, React 19)
- **Routing**: Expo Router (file-based navigation)
- **State & Persistence**: React Context + AsyncStorage
- **Icons**: `@expo/vector-icons`
- **TypeScript**: Strict typecheck enabled

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run in Web preview
npx expo start --web
```
