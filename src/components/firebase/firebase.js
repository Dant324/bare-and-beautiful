// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOSnbmrFMVJJiC67zA8tVGK8S0SXehqhE",
  authDomain: "bare-and-beautiful-f7654.firebaseapp.com",
  projectId: "bare-and-beautiful-f7654",
  storageBucket: "bare-and-beautiful-f7654.appspot.com",
  messagingSenderId: "609973247650",
  appId: "1:609973247650:web:74aedfb5d657dab94941fb",
  measurementId: "G-WCX2QJSBSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);