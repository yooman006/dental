# Dental Dashboard Application

## Project Setup

### Installation
1. Clone this repository
2. Run `npm install` to install all dependencies

### Available Scripts
- `npm run dev`: Starts development server
- `npm run build`: Creates production build


## Technology Stack

### Core Technologies
- React 19 (Latest version with concurrent features)
- Vite (Build tool and dev server)
- Tailwind CSS (Styling framework)
- React Router v7 (Client-side navigation)

### Key Dependencies
- @headlessui/react: For accessible UI components
- lucide-react: Icon library

## Architecture Overview

dental-dashboard/
|-- node_modules/ # Project dependencies
|-- public/ # Static assets
|-- src/
│ |-- assets/ # Images etc.
│ |-- components/ # Reusable UI components
│ │ |-- admin/ # Admin-specific components
│ │ │ |-- AppointmentForm.jsx
│ │ │ |-- Appointments.jsx
│ │ │ |-- CalendarView.jsx
│ │ │ |-- PatientForm.jsx|
│ │ │ |-- Patients.jsx
│ │ |-- auth/ # Authentication components
│ │ │ |-- LoginForm.jsx
│ │ │ |-- Dashboard.jsx
│ │ |-- LoadingSpinner.jsx 
│ |-- contexts/ # React contexts
│ │ |-- AuthContext.jsx
│ |-- pages/ # Page-level components
│ │ |-- LoginPage.jsx
│ |-- routes/ # Routing configuration
│ │ |-- index.jsx
│ |-- utils/ 
│ │ |-- mockData.js
│ |-- App.jsx # Root component
│ |-- main.jsx # Application entry point


### Technical Decisions
1. **Why Vite?**
   - Faster cold starts
   - Instant HMR (Hot Module Replacement)
   - Optimized builds

2. **Why Tailwind?**
   - Rapid UI development
   - No context switching between files
   - Easy customization

3. **React 19 Benefits**
   - Improved performance
   - Better state management
   - Future-ready architecture
