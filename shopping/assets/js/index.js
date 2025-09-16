const cartBtn = document.getElementById("cartBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const cartDropdown = document.getElementById("cartDropdown");
const wishlistDropdown = document.getElementById("wishlistDropdown");
const cartCountEl = document.querySelector(".cart-count");
const wishlistCountEl = document.querySelector(".wishlist-count");

let cart = [];
let wishlist = [];

cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle("open");
    wishlistDropdown.classList.remove("open");
});
wishlistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wishlistDropdown.classList.toggle("open");
    cartDropdown.classList.remove("open");
});
document.addEventListener("click", () => {
    cartDropdown.classList.remove("open");
    wishlistDropdown.classList.remove("open");
});
cartDropdown.addEventListener("click", (e) => e.stopPropagation());
wishlistDropdown.addEventListener("click", (e) => e.stopPropagation());

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".product-card");
        const title = card.querySelector(".product-title").textContent;
        const price = parseFloat(card.querySelector(".price-discount").textContent);
        const imgSrc = card.querySelector("img").src;

        const existing = cart.find(item => item.title === title);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ title, price, qty: 1, imgSrc });
        }
        updateCart();
    });
});

document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".product-card");
        const title = card.querySelector(".product-title").textContent;
        const price = parseFloat(card.querySelector(".price-discount").textContent);
        const imgSrc = card.querySelector("img").src;

        const index = wishlist.findIndex(item => item.title === title);
        if (index > -1) {
            wishlist.splice(index, 1);
            btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
        } else {
            wishlist.push({ title, price, imgSrc });
            btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        }
        updateWishlist();
    });
});

function updateCart() {
    cartDropdown.innerHTML = "";
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);


    if (totalItems > 0) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = "inline-block";
    } else {
        cartCountEl.textContent = "";
        cartCountEl.style.display = "none";
    }


    if (cart.length === 0) {
        cartDropdown.innerHTML = `<div class="empty-cart">Səbət boşdur</div>`;
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        const div = document.createElement("div");
        div.classList.add("dropdown-item");
        div.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="item-info">
                <span>${item.title}</span>
                <strong>${item.price}$</strong>
                <div class="qty-controls">
                    <button class="decrease">-</button>
                    <span>${item.qty}</span>
                    <button class="increase">+</button>
                </div>
            </div>
            <button class="remove-btn">&times;</button>
        `;
        cartDropdown.appendChild(div);

        div.querySelector(".increase").addEventListener("click", () => {
            item.qty++;
            updateCart();
        });
        div.querySelector(".decrease").addEventListener("click", () => {
            if (item.qty > 1) {
                item.qty--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
        div.querySelector(".remove-btn").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });
    });

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");
    totalDiv.innerHTML = `<span>Ümumi:</span> <span>${total.toFixed(2)}$</span>`;
    cartDropdown.appendChild(totalDiv);
}

function updateWishlist() {
    wishlistDropdown.innerHTML = "";

    if (wishlist.length > 0) {
        wishlistCountEl.textContent = wishlist.length;
        wishlistCountEl.style.display = "inline-block";
    } else {
        wishlistCountEl.textContent = "";
        wishlistCountEl.style.display = "none";
    }

    if (wishlist.length === 0) {
        wishlistDropdown.innerHTML = `<div class="empty-cart">Bəyəndiklərim siyahısı boşdur</div>`;
        return;
    }

    wishlist.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("dropdown-item");
        div.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="item-info">
                <span>${item.title}</span>
                <strong>${item.price}$</strong>
            </div>
            <button class="remove-btn">&times;</button>
        `;
        wishlistDropdown.appendChild(div);

        div.querySelector(".remove-btn").addEventListener("click", () => {
            wishlist.splice(index, 1);
            updateWishlist();
            document.querySelectorAll(".wishlist-btn").forEach(btn => {
                if (btn.closest(".product-card").querySelector(".product-title").textContent === item.title) {
                    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
                }
            });
        });
    });
}

updateCart();
updateWishlist();
