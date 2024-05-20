// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


const firebaseConfig = {
  apiKey: "AIzaSyDCXlULk7BNBUbdE5Pejx5_EGRMmTFrZEo",
  authDomain: "reactchat-e4926.firebaseapp.com",
  projectId: "reactchat-e4926",
  storageBucket: "reactchat-e4926.appspot.com",
  messagingSenderId: "686630829445",
  appId: "1:686630829445:web:f91f4d72d1b31e2a41d8ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()