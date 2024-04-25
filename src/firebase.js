import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Simplify auth import for web
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUcOCFYmBeIJsGBZCjtdMyX2nAAx1qIiM",
  authDomain: "nico-studios-6969e.firebaseapp.com",
  projectId: "nico-studios-6969e",
  storageBucket: "nico-studios-6969e.appspot.com",
  messagingSenderId: "782941193062",
  appId: "1:782941193062:web:575cf9c305e15488aabea7",
  measurementId: "G-9DKVQR22MY"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestore = getFirestore(app);
const auth = getAuth(app); // Use getAuth without React Native specific persistence

// Initialize Firebase Analytics if running in a web environment
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export { auth, firestore };
