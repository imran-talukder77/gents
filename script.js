// ===============================
// CART
// ===============================

const cartButtons = document.querySelectorAll(".add-cart");
const cartCount = document.getElementById("cart-count");


// LocalStorage থেকে আগের cart নেওয়া

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// প্রথমে cart count দেখানো

updateCartCount();


// প্রতিটি Add To Cart button

cartButtons.forEach((button) => {

    button.addEventListener("click", function () {

        // যে product card-এ click হয়েছে

        const productCard = this.closest(".product-card");


        // Product name

        const productName =
            productCard.querySelector("h3").innerText;


        // Product price

        const productPrice =
            productCard.querySelector(".price").innerText;


        // নতুন product object

        const product = {

            name: productName,

            price: productPrice

        };


        // Cart-এ add করা

        cart.push(product);


        // LocalStorage-এ save করা

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // Cart count update

        updateCartCount();


        // Button text change

        this.innerText = "Added ✓";


        // Message

        alert(
            productName + " added to cart!"
        );


        // 1.5 second পরে আবার আগের text

        setTimeout(() => {

            this.innerText = "Add To Cart";

        }, 1500);

    });

});


// ===============================
// UPDATE CART COUNT
// ===============================

function updateCartCount() {

    cartCount.innerText = cart.length;

}


// ===============================
// SHOP NOW BUTTON
// ===============================

const shopButton =
    document.querySelector(".hero button");


if (shopButton) {

    shopButton.addEventListener("click", function () {

        document
            .getElementById("shop")
            .scrollIntoView({

                behavior: "smooth"

            });

    });

}


// ===============================
// CART ICON CLICK
// ===============================

const cartIcon =
    document.querySelector(".cart-icon");


if (cartIcon) {

    cartIcon.addEventListener("click", function () {

        if (cart.length === 0) {

            alert("Your cart is empty!");

        }

        else {

            let cartMessage =
                "Your Cart:\n\n";


            cart.forEach((item, index) => {

                cartMessage +=
                    `${index + 1}. ${item.name} - ${item.price}\n`;

            });


            alert(cartMessage);

        }

    });

}