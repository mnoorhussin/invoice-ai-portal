import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase environment variables are configured
const isFirebaseConfigured = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if configured
let app = null;
let auth = null;
let db = null;

console.log('Checking Firebase configuration...');
console.log('Environment variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing'
});

if (isFirebaseConfigured()) {
  try {
    console.log('Initializing Firebase with config:', firebaseConfig);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    console.log('Database instance:', db);
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
} else {
  console.warn('Firebase not configured. Please create a .env file with Firebase credentials.');
}

export { app, auth, db };



