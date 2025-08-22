// Import only the Firebase functions we need for better tree shaking
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDKo06Dx1V7lIEG4LG8Gd1WjRhDHJHSaoc",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tallymail.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tallymail",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "tallymail.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "212729064673",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:212729064673:web:8c082966575979a8d01ba0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
