// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1u0wLvgCxSl8tjngV-AKk86NHrXDGgCg",
  authDomain: "web-prog-finals.firebaseapp.com",
  projectId: "web-prog-finals",
  storageBucket: "web-prog-finals.firebasestorage.app",
  messagingSenderId: "870582684123",
  appId: "1:870582684123:web:68a398d97b61446f9abffe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
