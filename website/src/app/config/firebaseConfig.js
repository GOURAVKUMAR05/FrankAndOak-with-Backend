// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABHoVAWIyl7XOlBcqs6mKXYBhV1MJNKlk",
  authDomain: "frank-and-oak-auth.firebaseapp.com",
  projectId: "frank-and-oak-auth",
  storageBucket: "frank-and-oak-auth.firebasestorage.app",
  messagingSenderId: "354810593290",
  appId: "1:354810593290:web:15ee253310d6b17cf5dff3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export the Auth instance
export const auth = getAuth(app);
export default app;
