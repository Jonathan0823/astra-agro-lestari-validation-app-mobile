import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_FIREBASE_KEY,
  authDomain: process.env.EXPO_PUBLIC_API_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_API_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_API_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_API_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_API_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_API_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
