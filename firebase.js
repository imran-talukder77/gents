// =========================================================
// GENTS COTTAGE - FIREBASE CONFIGURATION
// =========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =========================================================
// FIREBASE CONFIG
// =========================================================

const firebaseConfig = {

    apiKey: "AIzaSyDmhq96_0766Rlh4B8BffPHFCKHHOgnOjk",

    authDomain: "gents-cottage.firebaseapp.com",

    projectId: "gents-cottage",

    storageBucket: "gents-cottage.firebasestorage.app",

    messagingSenderId: "827979587396",

    appId: "1:827979587396:web:be87aaf1861b1ce84f4111",

    measurementId: "G-WD1WV0SL4Q"

};


// =========================================================
// INITIALIZE FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);


// =========================================================
// INITIALIZE FIRESTORE
// =========================================================

const db = getFirestore(app);


// =========================================================
// EXPORT
// =========================================================

export {
    app,
    db
};