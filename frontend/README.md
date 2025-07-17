# LendScore Frontend

A modern, responsive React web application for AI-powered loan approval prediction.

## Features

- **User Authentication**: Firebase-based registration and login
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Loan Application**: Comprehensive form with real-time validation
- **AI Predictions**: Integration with machine learning backend for instant loan approval predictions
- **Loan History**: Track all applications and their status
- **Modern UI**: Minimalist design with smooth animations and transitions

## Tech Stack

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Firebase** - Authentication and database
- **CSS3** - Modern styling with flexbox and grid
- **Vite** - Fast development build tool

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config and update `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

4. Start the development server:
```bash
npm run dev
```

## Backend Integration

The frontend expects the backend API to be running on `http://localhost:8001`. Make sure to:

1. Start the FastAPI backend server
2. Ensure CORS is properly configured
3. Verify the `/predict` endpoint is accessible

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Home.jsx        # Dashboard/home page
│   ├── CreateLoan.jsx  # Loan application form
│   └── LoanHistory.jsx # Loan history viewer
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── firebase.js         # Firebase configuration
├── App.jsx            # Main app component
├── App.css           # Global styles
└── main.jsx          # Application entry point
```

## Features Overview

### Authentication
- Firebase-based user registration and login
- Secure password handling
- User profile management
- Persistent login sessions

### Loan Application
- Comprehensive form with all required fields
- Real-time form validation
- Integration with ML backend for predictions
- Instant results with recommendations

### Dashboard
- User profile display
- Quick access to all features
- Responsive card-based layout
- Application statistics

### Loan History
- Complete history of all applications
- Detailed view of each application
- Filter and search capabilities
- Export functionality (planned)

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file for environment-specific configurations:

```
VITE_API_URL=http://localhost:8001
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
# ... other Firebase config
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

### Recommended Hosting
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
