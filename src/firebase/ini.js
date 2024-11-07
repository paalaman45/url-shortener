import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdfPbfTX-skedF0TqmuUvYbyq7uQNsKVk",
  authDomain: "vue-url-shortener-f75bb.firebaseapp.com",
  projectId: "vue-url-shortener-f75bb",
  storageBucket: "vue-url-shortener-f75bb.firebasestorage.app",
  messagingSenderId: "1001888201611",
  appId: "1:1001888201611:web:55bd171eef0d49ae12cd8e",
  measurementId: "G-C642SSF5ZH"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore()
export default db