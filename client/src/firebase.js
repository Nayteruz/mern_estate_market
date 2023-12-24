// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'estate-market-8b96b.firebaseapp.com',
  projectId: 'estate-market-8b96b',
  storageBucket: 'estate-market-8b96b.appspot.com',
  messagingSenderId: '323848576375',
  appId: '1:323848576375:web:fcca161221a7b514de1572',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
