// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyACXu6cGtlhgqEZrVFiaBPIv8OglcFs5CY",
    authDomain: "whiteboard-1a132.firebaseapp.com",
    databaseURL: "https://whiteboard-1a132-default-rtdb.asia-southeast1.firebasedatabase.app", // Correct database URL
    projectId: "whiteboard-1a132",
    storageBucket: "whiteboard-1a132.appspot.com",
    messagingSenderId: "514322270305",
    appId: "1:514322270305:web:697de6fdb32336ec5c8220",
    measurementId: "G-J8WCJ23DD5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);