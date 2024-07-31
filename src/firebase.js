// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAklqqDBfUbQa241F8okixVKAlAmY2LoV8",
  authDomain: "finance-tracker-befde.firebaseapp.com",
  projectId: "finance-tracker-befde",
  storageBucket: "finance-tracker-befde.appspot.com",
  messagingSenderId: "513991742036",
  appId: "1:513991742036:web:8cdec676aed0a5574093c1",
  measurementId: "G-Z1MSTKJ1WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };