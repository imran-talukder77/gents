"use strict";

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* =========================================================
   GENTS COTTAGE
   Professional E-Commerce JavaScript
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.querySelector(".nav-menu");

const searchBtn = document.getElementById("search-btn");
const searchOverlay = document.getElementById("search-overlay");
const closeSearch = document.getElementById("close-search");
const searchInput = document.getElementById("search-input");

const cartBtn = document.getElementById("cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const closeCart = document.getElementById("close-cart");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const backToTop = document.getElementById("back-to-top");

const orderForm = document.getElementById("order-form");
const orderProduct = document.getElementById("product");
const orderQuantity = document.getElementById("quantity");
const orderSize = document.getElementById("size");
const message = document.getElementById("message");

const newsletterForm =
    document.getElementById("newsletter-form");


/* =========================================================
   PRODUCT DATABASE
========================================================= */

const products = [
    {
        id: 1,
        name: "Premium Polo Shirt",
        price: 1250,
        category: "shirt",
        image: "images/product1.jpg"
    },

    {
        id: 2,
        name: "Classic T-Shirt",
        price: 850,
        category: "tshirt",
        image: "images/product2.jpg"
    },

    {
        id: 3,
        name: "Men's Casual Shoes",
        price: 2500,
        category: "shoes",
        image: "images/product3.jpg"
    },

    {
        id: 4,
        name: "Luxury Watch",
        price: 3200,
        category: "watch",
        image: "images/product4.jpg"
    },

    {
        id: 5,
        name: "Premium Formal Shirt",
        price: 1450,
        category: "shirt",
        image: "images/product5.jpg"
    },

    {
        id: 6,
        name: "Premium Oversized T-Shirt",
        price: 960,
        category: "tshirt",
        image: "images/product6.jpg"
    }
];


/* =========================================================
   CART STATE
========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem("gentsCottageCart")
    ) || [];


/* =========================================================
   WISHLIST STATE
========================================================= */

let wishlist =
    JSON.parse(
        localStorage.getItem("gentsCottageWishlist")
    ) || [];


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "gentsCottageCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   SAVE WISHLIST
========================================================= */

function saveWishlist() {

    localStorage.setItem(
        "gentsCottageWishlist",
        JSON.stringify(wishlist)
    );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return `৳ ${Number(price).toLocaleString("en-BD")}`;

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }


    saveCart();
    updateCartCount();
    renderCart();

    showNotification(
        `${product.name} added to cart`
    );

}


/* =========================================================
   ADD PRODUCT USING DATA-PRODUCT
========================================================= */

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const productName =
                    button.dataset.product;

                const product =
                    products.find(
                        item =>
                            item.name === productName
                    );

                if (product) {

                    addToCart(product.id);

                    // Cart automatically open
                    openCart();

                }

            }
        );

    });


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    updateCartCount();
    renderCart();

    showNotification(
        "Product removed from cart"
    );

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(productId, change) {

    const product =
        cart.find(
            item => item.id === productId
        );

    if (!product) return;


    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);
        return;

    }


    saveCart();
    updateCartCount();
    renderCart();

}


/* =========================================================
   CALCULATE CART TOTAL
========================================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            item.price * item.quantity,
        0
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems || !cartTotal) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>
                    Add some products to your cart.
                </p>

            </div>

        `;

        cartTotal.textContent = "৳ 0";

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    ${formatPrice(item.price)}
                </p>


                <div class="cart-item-bottom">

                    <div class="quantity-control">

                        <button
                            class="quantity-btn"
                            data-id="${item.id}"
                            data-action="minus"
                        >
                            -
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-btn"
                            data-id="${item.id}"
                            data-action="plus"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="remove-item"
                        data-id="${item.id}"
                        title="Remove"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>


                <button
                    class="cart-order-btn"
                    data-id="${item.id}"
                >
                    ORDER NOW
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>

        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent =
        formatPrice(
            calculateCartTotal()
        );


    attachCartEvents();

}


/* =========================================================
   CART EVENTS
========================================================= */

function attachCartEvents() {


    /* Quantity */

    document
        .querySelectorAll(".quantity-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    const action =
                        button.dataset.action;


                    changeQuantity(
                        id,
                        action === "plus"
                            ? 1
                            : -1
                    );

                }
            );

        });


    /* Remove */

    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    removeFromCart(id);

                }
            );

        });


    /* ORDER NOW */

    document
        .querySelectorAll(".cart-order-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    orderProductFromCart(id);

                }
            );

        });

}


/* =========================================================
   ORDER PRODUCT FROM CART
========================================================= */

function orderProductFromCart(productId) {

    const cartProduct =
        cart.find(
            item => item.id === productId
        );

    if (!cartProduct) return;


    /*
       Product automatically select হবে
    */

    if (orderProduct) {

        orderProduct.value =
            cartProduct.name;

    }


    /*
       Quantity automatically বসবে
    */

    if (orderQuantity) {

        orderQuantity.value =
            cartProduct.quantity;

    }


    /*
       Size reset
    */

    if (orderSize) {

        orderSize.value = "";

    }


    /*
       Cart close
    */

    closeCartDrawer();


    /*
       Order section-এ নিয়ে যাবে
    */

    const orderSection =
        document.getElementById("order");

    if (orderSection) {

        setTimeout(() => {

            orderSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 250);

    }


    /*
       Product field highlight
    */

    if (orderProduct) {

        setTimeout(() => {

            orderProduct.focus();

        }, 700);

    }


    showNotification(
        `${cartProduct.name} selected for order`
    );

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    if (!cartDrawer || !cartOverlay) return;


    cartDrawer.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCartDrawer() {

    if (!cartDrawer || !cartOverlay) return;


    cartDrawer.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================================
   CART BUTTON
========================================================= */

if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCart
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartDrawer
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCartDrawer
    );

}


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

/* =========================================================
   PROFESSIONAL CHECKOUT
========================================================= */

let checkoutCart = [];

function prepareCheckout() {

    if (!cart || cart.length === 0) {

        showNotification("Your cart is empty");

        return false;
    }

    // Create a safe copy of current cart
    checkoutCart = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ""
    }));

    return true;
}


/* =========================================================
   CHECKOUT SUMMARY
========================================================= */

function getCheckoutTotal() {

    return checkoutCart.reduce(
        (total, item) => {

            return total +
                (Number(item.price) *
                    Number(item.quantity));

        },
        0
    );

}


function getCheckoutItemCount() {

    return checkoutCart.reduce(
        (total, item) => {

            return total +
                Number(item.quantity);

        },
        0
    );

}


/* =========================================================
   CREATE CHECKOUT SUMMARY
========================================================= */

function renderCheckoutSummary() {

    let summary =
        document.getElementById(
            "checkout-order-summary"
        );


    /*
       যদি HTML-এ summary না থাকে,
       তাহলে automatically create হবে।
    */

    if (!summary) {

        summary =
            document.createElement("div");

        summary.id =
            "checkout-order-summary";

        summary.className =
            "checkout-order-summary";


        if (orderForm) {

            orderForm.parentNode.insertBefore(
                summary,
                orderForm
            );

        }

    }


    const total =
        getCheckoutTotal();


    const itemCount =
        getCheckoutItemCount();


    summary.innerHTML = `

        <div class="checkout-summary-header">

            <div>

                <h3>
                    <i class="fa-solid fa-bag-shopping"></i>
                    Your Order
                </h3>

                <span>
                    ${itemCount}
                    item${itemCount !== 1 ? "s" : ""}
                </span>

            </div>

        </div>


        <div class="checkout-products">

            ${checkoutCart.map(item => {

        const subtotal =
            Number(item.price) *
            Number(item.quantity);

        return `

                    <div class="checkout-product">

                        <div class="checkout-product-left">

                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >

                            <div>

                                <strong>
                                    ${item.name}
                                </strong>

                                <span>
                                    ${formatPrice(item.price)}
                                    ×
                                    ${item.quantity}
                                </span>

                            </div>

                        </div>


                        <strong>
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>

                `;

    }).join("")}

        </div>


        <div class="checkout-summary-total">

            <span>
                Total Amount
            </span>

            <strong>
                ${formatPrice(total)}
            </strong>

        </div>

    `;

}


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

document
    .querySelector(".checkout-btn")
    ?.addEventListener(
        "click",
        () => {

            /*
               Prepare COMPLETE cart
            */

            if (!prepareCheckout()) {

                return;

            }


            /*
               Render all products + total
            */

            renderCheckoutSummary();


            /*
               For compatibility with
               existing form fields,
               select first product.
            */

            const firstProduct =
                checkoutCart[0];


            if (firstProduct) {

                if (orderProduct) {

                    orderProduct.value =
                        firstProduct.name;

                }


                if (orderQuantity) {

                    orderQuantity.value =
                        firstProduct.quantity;

                }

            }


            /*
               Close cart
            */

            closeCartDrawer();


            /*
               Go to order section
            */

            const orderSection =
                document.getElementById("order");


            if (orderSection) {

                setTimeout(() => {

                    orderSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 250);

            }


            showNotification(
                "Your complete order is ready for checkout"
            );

        }
    );

/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle("active");


            const icon =
                menuBtn.querySelector("i");


            if (
                navMenu.classList.contains(
                    "active"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

document
    .querySelectorAll(".nav-menu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (!navMenu) return;

                navMenu.classList.remove(
                    "active"
                );


                const icon =
                    menuBtn?.querySelector("i");


                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            }
        );

    });


/* =========================================================
   SEARCH
========================================================= */

if (searchBtn && searchOverlay) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchOverlay.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";


            setTimeout(() => {

                searchInput?.focus();

            }, 200);

        }
    );

}


function closeSearchOverlay() {

    if (!searchOverlay) return;


    searchOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow = "";


    if (searchInput) {

        searchInput.value = "";

    }

}


if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        closeSearchOverlay
    );

}


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const productCards =
                document.querySelectorAll(
                    ".product-card"
                );


            productCards.forEach(card => {

                const name =
                    card
                        .querySelector("h3")
                        ?.textContent
                        .toLowerCase() || "";


                const category =
                    card
                        .querySelector(
                            ".product-category"
                        )
                        ?.textContent
                        .toLowerCase() || "";


                if (
                    name.includes(keyword) ||
                    category.includes(keyword)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

}


/* =========================================================
   SEARCH OVERLAY CLICK
========================================================= */

if (searchOverlay) {

    searchOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                searchOverlay
            ) {

                closeSearchOverlay();

            }

        }
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeSearchOverlay();

            closeCartDrawer();

        }

    }
);


/* =========================================================
   WISHLIST
========================================================= */

document
    .querySelectorAll(".wishlist-product")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                if (!card) return;


                const productName =
                    card
                        .querySelector("h3")
                        ?.textContent
                        .trim();


                const product =
                    products.find(
                        item =>
                            item.name ===
                            productName
                    );


                if (!product) return;


                const icon =
                    button.querySelector("i");


                const wishlistIndex =
                    wishlist.indexOf(
                        product.id
                    );


                if (
                    wishlistIndex === -1
                ) {

                    wishlist.push(
                        product.id
                    );


                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );


                    showNotification(
                        "Added to wishlist"
                    );

                } else {

                    wishlist.splice(
                        wishlistIndex,
                        1
                    );


                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );


                    showNotification(
                        "Removed from wishlist"
                    );

                }


                saveWishlist();

            }
        );

    });


/* =========================================================
   RESTORE WISHLIST
========================================================= */

function restoreWishlistUI() {

    document
        .querySelectorAll(
            ".wishlist-product"
        )
        .forEach(button => {

            const card =
                button.closest(
                    ".product-card"
                );

            if (!card) return;


            const productName =
                card
                    .querySelector("h3")
                    ?.textContent
                    .trim();


            const product =
                products.find(
                    item =>
                        item.name ===
                        productName
                );


            if (
                product &&
                wishlist.includes(product.id)
            ) {

                const icon =
                    button.querySelector("i");


                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

            }

        });

}


/* =========================================================
   QUICK VIEW
========================================================= */

document
    .querySelectorAll(".quick-view")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                if (!card) return;


                const name =
                    card
                        .querySelector("h3")
                        ?.textContent
                        .trim();


                const price =
                    card
                        .querySelector(".price")
                        ?.textContent
                        .trim();


                const image =
                    card
                        .querySelector("img")
                        ?.src;


                openProductModal(
                    name,
                    price,
                    image
                );

            }
        );

    });


/* =========================================================
   QUICK CART
========================================================= */

document
    .querySelectorAll(".quick-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                if (!card) return;


                const productName =
                    card
                        .querySelector("h3")
                        ?.textContent
                        .trim();


                const product =
                    products.find(
                        item =>
                            item.name ===
                            productName
                    );


                if (product) {

                    addToCart(product.id);

                    openCart();

                }

            }
        );

    });


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProductModal(
    name,
    price,
    image
) {

    const modal =
        document.createElement("div");

    modal.className =
        "product-modal";


    modal.innerHTML = `

        <div class="modal-content">

            <button class="modal-close">
                <i class="fa-solid fa-xmark"></i>
            </button>


            <div class="modal-image">

                <img
                    src="${image}"
                    alt="${name}"
                >

            </div>


            <div class="modal-info">

                <p class="modal-label">
                    GENTS COTTAGE
                </p>

                <h2>${name}</h2>

                <div class="modal-stars">
                    ★★★★★
                </div>

                <h3>${price}</h3>

                <p>
                    Premium quality product
                    designed for modern gentlemen.
                    Comfortable, stylish and perfect
                    for everyday use.
                </p>


                <button class="modal-add-cart">

                    ADD TO CART

                    <i class="fa-solid fa-bag-shopping"></i>

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        modal.classList.add("active");

    }, 10);


    modal
        .querySelector(".modal-close")
        .addEventListener(
            "click",
            () => {

                closeProductModal(modal);

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeProductModal(modal);

            }

        }
    );


    modal
        .querySelector(".modal-add-cart")
        .addEventListener(
            "click",
            () => {

                const product =
                    products.find(
                        item =>
                            item.name ===
                            name
                    );


                if (product) {

                    addToCart(product.id);

                    closeProductModal(
                        modal
                    );

                    openCart();

                }

            }
        );

}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal(modal) {

    modal.classList.remove(
        "active"
    );


    setTimeout(() => {

        modal.remove();

        document.body.style.overflow =
            "";

    }, 300);

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            const category =
                button.dataset.category;


            document
                .querySelectorAll(
                    ".product-card"
                )
                .forEach(card => {

                    const cardCategory =
                        card.dataset.category;


                    if (
                        category === "all" ||
                        cardCategory ===
                        category
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                });

        }
    );

});


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(text) {

    const old =
        document.querySelector(
            ".shop-notification"
        );


    if (old) old.remove();


    const notification =
        document.createElement("div");


    notification.className =
        "shop-notification";


    notification.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>${text}</span>

    `;


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 10);


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!navbar) return;


        if (window.scrollY > 50) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }
);


/* =========================================================
   BACK TO TOP
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!backToTop) return;


        if (window.scrollY > 500) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }
);


if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,
                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-menu a"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >=
                sectionTop &&
                window.scrollY <
                sectionTop +
                sectionHeight
            ) {

                current =
                    section.getAttribute(
                        "id"
                    );

            }

        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href ===
                `#${current}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }
);


/* =========================================================
   ORDER FORM
========================================================= */


/* ========================================================= ORDER FORM PROFESSIONAL CHECKOUT + ORDER CONFIRMATION ========================================================= */ if (orderForm) { orderForm.addEventListener("submit", async function (event) { event.preventDefault(); /* ===================================================== GET FORM DATA ===================================================== */ const name = document.getElementById("name")?.value.trim() || ""; const phone = document.getElementById("phone")?.value.trim() || ""; const address = document.getElementById("address")?.value.trim() || ""; const product = document.getElementById("product")?.value || ""; const quantity = Number(document.getElementById("quantity")?.value || 0); const size = document.getElementById("size")?.value || ""; const payment = document.getElementById("payment")?.value || ""; /* ===================================================== VALIDATION ===================================================== */ if (!name) { showNotification("Please enter your name"); return; } if (!phone) { showNotification("Please enter your phone number"); return; } if (!/^01[3-9]\d{8}$/.test(phone)) { showNotification("Please enter a valid Bangladesh phone number"); return; } if (!address) { showNotification("Please enter your address"); return; } if (!payment) { showNotification("Please select payment method"); return; } /* ===================================================== PREPARE ORDER ITEMS ===================================================== */ let orderItems = []; /* যদি Checkout থেকে cart আসে */ if (Array.isArray(checkoutCart) && checkoutCart.length > 0) { orderItems = checkoutCart.map(item => ({ id: Number(item.id), name: item.name, price: Number(item.price), quantity: Number(item.quantity), size: item.size || size || "", image: item.image || "" })); } /* যদি সরাসরি single product order হয় */ else { if (!product) { showNotification("Please select a product"); return; } if (!quantity || quantity < 1) { showNotification("Please enter valid quantity"); return; } const selectedProduct = products.find(item => item.name === product); if (!selectedProduct) { showNotification("Product not found"); return; } orderItems = [{ id: selectedProduct.id, name: selectedProduct.name, price: Number(selectedProduct.price), quantity: quantity, size: size || "", image: selectedProduct.image }]; } /* ===================================================== SAFETY CHECK ===================================================== */ if (orderItems.length === 0) { showNotification("No products found in your order"); return; } /* ===================================================== CALCULATE TOTAL ===================================================== */ const totalPrice = orderItems.reduce((total, item) => { return total + (Number(item.price) * Number(item.quantity)); }, 0); const totalItems = orderItems.reduce((total, item) => { return total + Number(item.quantity); }, 0); /* ===================================================== CREATE ORDER ID ===================================================== */ const orderId = "GC-" + Date.now().toString().slice(-8); /* ===================================================== ORDER OBJECT ===================================================== */ const confirmedOrder = { orderId: orderId, customer: { name: name, phone: phone, address: address }, items: orderItems, totalItems: totalItems, totalPrice: totalPrice, paymentMethod: payment, orderDate: new Date().toISOString(), status: "Confirmed" }; 

/* =====================================================
   SAVE ORDER TO FIREBASE
===================================================== */

try {

    const orderRef = await addDoc(
        collection(db, "orders"),
        {
            ...confirmedOrder,
            createdAt: serverTimestamp()
        }
    );

    console.log(
        "Order saved to Firebase:",
        orderRef.id
    );

} catch (error) {

    console.error(
        "Firebase order error:",
        error
    );

    showNotification(
        "Order could not be saved. Please try again."
    );

    return;

}

/* ===================================================== SHOW PROFESSIONAL CONFIRMATION ===================================================== */ if (message) { message.innerHTML = ` <div class="order-success"> <div class="success-icon"> ✓ </div> <h3> Order Confirmed! </h3> <p> Thank you, <strong>${name}</strong>. </p> <div class="order-confirm-box"> <p> <strong>Order ID:</strong> ${orderId} </p> <p> <strong>Total Items:</strong> ${totalItems} </p> <p> <strong>Total Amount:</strong> ${formatPrice(totalPrice)} </p> <p> <strong>Payment:</strong> ${payment} </p> </div> <div class="confirmed-products"> <h4> Order Summary </h4> ${orderItems.map(item => ` <div class="confirmed-product"> <span> ${item.name} × ${item.quantity} </span> <strong> ${formatPrice(item.price * item.quantity)} </strong> </div> `).join("")} </div> <p class="order-note"> We have received your order. Our team will contact you shortly. </p> </div> `; } /* ===================================================== SUCCESS NOTIFICATION ===================================================== */ showNotification(`Order ${orderId} confirmed successfully!`); /* ===================================================== CLEAR CART ===================================================== */ cart = []; checkoutCart = []; saveCart(); updateCartCount(); renderCart(); /* ===================================================== RESET FORM ===================================================== */ orderForm.reset(); if (orderQuantity) { orderQuantity.value = 1; } /* ===================================================== SCROLL TO CONFIRMATION ===================================================== */ if (message) { setTimeout(() => { message.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150); } }); }





/* =========================================================
   NEWSLETTER
========================================================= */

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                newsletterForm
                    .querySelector("input")
                    ?.value
                    .trim();


            if (!email) return;


            showNotification(
                "Successfully subscribed!"
            );


            newsletterForm.reset();

        }
    );

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    targetId === "#" ||
                    targetId === ""
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    event.preventDefault();


                    target.scrollIntoView({

                        behavior: "smooth"

                    });

                }

            }
        );

    });


/* =========================================================
   INITIALIZE STORE
========================================================= */

function initializeStore() {

    updateCartCount();

    renderCart();

    restoreWishlistUI();

}


initializeStore();


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "Gents Cottage Store initialized successfully."
);