// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPU2zYhqNPpJ8hK1T6-8kFjyorO2g1MOo",
  authDomain: "chatapp-1924d.firebaseapp.com",
  projectId: "chatapp-1924d",
  storageBucket: "chatapp-1924d.appspot.com",
  messagingSenderId: "377399507951",
  appId: "1:377399507951:web:7d04b4bf0e1f22f07e541a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()