import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDmhq96_0766Rlh4B8BffPHFCKHHOgnOjk",
    authDomain: "gents-cottage.firebaseapp.com",
    projectId: "gents-cottage",
    storageBucket: "gents-cottage.firebasestorage.app",
    messagingSenderId: "827979587396",
    appId: "1:827979587396:web:be87aaf1861b1ce84f4111",
    measurementId: "G-WD1WV0SL4Q"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// ==========================
// ORDER FORM
// ==========================

const orderForm = document.getElementById("order-form");
const message = document.getElementById("message");


if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name = document.getElementById("name").value;

        const phone = document.getElementById("phone").value;

        const address = document.getElementById("address").value;

        const product = document.getElementById("product").value;

        const quantity = document.getElementById("quantity").value;


        try {

            await addDoc(
                collection(db, "orders"),
                {
                    name: name,
                    phone: phone,
                    address: address,
                    product: product,
                    quantity: Number(quantity),
                    status: "Pending",
                    createdAt: serverTimestamp()
                }
            );


            message.innerText =
                "Order Successful! Thank You ❤️";


            orderForm.reset();


        } catch (error) {

            console.error(error);

            message.innerText =
                "Order Failed! Please try again.";

        }

    });

}