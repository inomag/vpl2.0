// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtWpoFL9NlN1KDpIYrkkQca7vPSKrELM0",
  authDomain: "vpl2-ef9b6.firebaseapp.com",
  projectId: "vpl2-ef9b6",
  storageBucket: "vpl2-ef9b6.firebasestorage.app",
  messagingSenderId: "886000683758",
  appId: "1:886000683758:web:d72304763fc6ad79b641ff"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

// Initialize Firebase

export { db };