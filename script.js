function peso(n) {
    return "₱" + Number(n).toLocaleString("en-PH");
}
function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}


function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        return false;
    }
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

const toastEl = document.getElementById("orderToast");
let toastTimer = null;


function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toastEl.classList.remove("show");
    }, 3200);
}


const countEl = document.getElementById("cart-count");
let count = 0;


try {
    count = Number(localStorage.getItem("gadgetHubCartCount")) || 0;
} catch (error) {
    count = 0;
}


function showCount() {
    if (!countEl) return;
    countEl.textContent = count;
    countEl.classList.toggle("show", count > 0);
}


function getCart() {
    return readJSON("gadgetHubCart", []);
}


function saveCart(cart) {
    writeJSON("gadgetHubCart", cart);
    count = cart.reduce(function (sum, item) {
        return sum + (Number(item.quantity) || 1);
    }, 0);
    try {
        localStorage.setItem("gadgetHubCartCount", count);
    } catch (error) { /* ignore */ }
    showCount();
}


function addToCart(btn, product) {
    if (!product) {
        showToast("Please pick a product from the Items list.");
        goTo("items");
        return;
    }


    const cart = getCart();
    const existing = cart.find(function (item) {
        return item.name === product.name;
    });


    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }


    saveCart(cart);


    if (btn) {
        const original = btn.textContent;
        btn.textContent = "Added ✓";
        setTimeout(function () {
            btn.textContent = original;
        }, 1200);
    }


    renderCart();
}
showCount();


document.querySelectorAll(".card .add-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
        addToCart(btn);
    });
});


const products = [


    /* Laptops */
    { name: "Apple MacBook Air 13-inch (M3)", price: 65990, category: "Laptop", image: "img/macbook.jpg",
      intro: "Thin, fanless Apple laptop with all-day battery life.",
      specs: ["Apple M3 chip, 8GB RAM", "256GB SSD", "13.6\" Liquid Retina display", "Up to 18 hours battery"] },
    { name: "ASUS ROG Zephyrus G14", price: 119995, category: "Laptop", image: "img/asus.jpg",
      intro: "Compact gaming laptop with a sharp OLED screen.",
      specs: ["AMD Ryzen 9 8945HS, 16GB RAM", "1TB SSD", "RTX 4060 graphics", "14\" 3K OLED, 120Hz"] },
    { name: "Dell XPS 13", price: 95990, category: "Laptop", image: "img/dell.jpg",
      intro: "Premium ultraportable with a nearly borderless display.",
      specs: ["Intel Core Ultra 7, 16GB RAM", "512GB SSD", "13.4\" display", "Aluminum body"] },
    { name: "Lenovo ThinkPad X1 Carbon", price: 115990, category: "Laptop", image: "img/lenovo.jpg",
      intro: "Lightweight business laptop famous for its keyboard.",
      specs: ["Intel Core Ultra 7, 16GB RAM", "512GB SSD", "14\" display", "About 1.1kg"] },
    { name: "Microsoft Surface Laptop 7th Edition", price: 69990, category: "Laptop", image: "img/microsoft.jpg",
      intro: "Sleek Windows laptop with a touchscreen and fast battery.",
      specs: ["Snapdragon X Plus, 16GB RAM", "256GB SSD", "13.8\" touchscreen", "Windows 11 Copilot+ PC"] },


    /* PC Setup */
    { name: "Apple iMac 24-inch (M4)", price: 84990, category: "PC Setup", image: "img/imac.jpg",
      intro: "All-in-one desktop with the screen, camera and speakers built in.",
      specs: ["Apple M4 chip, 16GB RAM", "256GB SSD", "24\" 4.5K Retina display", "Magic Keyboard and mouse"] },
    { name: "Apple Mac mini (M4)", price: 32990, category: "PC Setup", image: "img/apple.jpg",
      intro: "Tiny desktop that is powerful enough for most daily work.",
      specs: ["Apple M4 chip, 16GB RAM", "256GB SSD", "Very small case", "Monitor not included"] },
    { name: "Alienware Aurora R16", price: 149990, category: "PC Setup", image: "img/alin.jpg",
      intro: "Ready-made gaming desktop with a bold, glowing case.",
      specs: ["Intel Core i7, 16GB RAM", "RTX 4070 graphics", "1TB SSD", "Liquid cooling"] },
    { name: "Corsair Vengeance i7500", price: 189990, category: "PC Setup", image: "img/corsair.jpg",
      intro: "High-end prebuilt PC for 4K gaming and streaming.",
      specs: ["Intel Core i7, 32GB DDR5", "RTX 4070 Ti SUPER", "2TB SSD", "Tempered glass case"] },
    { name: "Lenovo Legion Tower 5", price: 79990, category: "PC Setup", image: "img/tower.jpg",
      intro: "Good-value gaming tower for 1080p and 1440p play.",
      specs: ["AMD Ryzen 7, 16GB RAM", "RTX 4060 graphics", "1TB SSD", "Tower case with RGB"] },


    /* Mouse */
    { name: "Logitech MX Master 3S", price: 6495, category: "Mouse", image: "img/logi.jpg",
      intro: "The popular productivity mouse with a quiet, precise scroll wheel.",
      specs: ["8,000 DPI", "Quiet clicks", "Bluetooth + Logi Bolt", "USB-C, up to 70 days battery"] },
    { name: "Logitech G PRO X SUPERLIGHT 2", price: 7995, category: "Mouse", image: "img/logitech g.jpg",
      intro: "Ultra-light wireless mouse used by esports players.",
      specs: ["Up to 32,000 DPI", "Under 60g", "LIGHTSPEED wireless", "Up to 95 hours battery"] },
    { name: "Razer DeathAdder V3 Pro", price: 8995, category: "Mouse", image: "img/razer.jpg",
      intro: "Ergonomic wireless gaming mouse with a classic shape.",
      specs: ["Up to 30,000 DPI", "About 63g", "HyperSpeed wireless", "Up to 90 hours battery"] },
    { name: "Apple Magic Mouse", price: 5990, category: "Mouse", image: "img/applemouse.jpg",
      intro: "Smooth multi-touch mouse that works great with a Mac.",
      specs: ["Multi-Touch surface", "Bluetooth", "Rechargeable battery", "Works with Mac and iPad"] },
    { name: "Logitech MX Anywhere 3S", price: 4995, category: "Mouse", image: "img/logitech.jpg",
      intro: "Small travel mouse that still tracks on glass.",
      specs: ["8,000 DPI", "Quiet clicks", "Bluetooth + Logi Bolt", "USB-C, up to 70 days battery"] },


    /* Keyboard */
    { name: "Logitech MX Keys S", price: 6495, category: "Keyboard", image: "img/logitech.jpg",
      intro: "Comfortable low-profile keyboard with smart backlighting.",
      specs: ["Wireless, Bluetooth + Logi Bolt", "Backlit keys", "USB-C rechargeable", "Connects up to 3 devices"] },
    { name: "Keychron K8 Pro", price: 5995, category: "Keyboard", image: "img/keychron.jpg",
      intro: "Wireless mechanical keyboard that works on Mac and Windows.",
      specs: ["Tenkeyless 87 keys", "Hot-swappable switches", "Bluetooth 5.1 or USB-C", "RGB backlight"] },
    { name: "Razer BlackWidow V4 X", price: 7495, category: "Keyboard", image: "img/v4.jpg",
      intro: "Full-size mechanical keyboard built for gaming.",
      specs: ["Razer Green mechanical switches", "Chroma RGB lighting", "6 macro keys", "Detachable wrist rest"] },
    { name: "Apple Magic Keyboard", price: 5490, category: "Keyboard", image: "img/magic.jpg",
      intro: "Slim, quiet keyboard that pairs easily with Mac and iPad.",
      specs: ["Bluetooth wireless", "Rechargeable battery", "Scissor-switch keys", "Works with Mac and iPad"] },
    { name: "Redragon Kumara K552", price: 1500, category: "Keyboard", image: "img/k380.jpg",
      intro: "Budget mechanical keyboard that is great for first-time gamers.",
      specs: ["Tenkeyless 87 keys", "Red mechanical switches", "Wired USB", "LED backlight"] }
];

const CARD_GAP = 22;


const trackEl = document.getElementById("products");
const loopEl = document.querySelector(".loop");
let currentCategory = "All";


function buildProductCard(product) {
    const card = el("article", "product-card");


    const img = el("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";
    card.appendChild(img);


    card.appendChild(el("p", "product-category", product.category));
    card.appendChild(el("h3", "", product.name));
    card.appendChild(el("p", "product-intro", product.intro));


    const specs = el("ul", "product-specs");
    product.specs.forEach(function (s) {
        specs.appendChild(el("li", "", s));
    });
    card.appendChild(specs);


    card.appendChild(el("p", "product-price", peso(product.price)));


    const actions = el("div", "product-actions");


    const buyBtn = el("button", "buy-button", "Buy Now");
    buyBtn.type = "button";
    buyBtn.addEventListener("click", function () {
        openCheckout(product);
    });


    const cartBtn = el("button", "add-cart", "Add to Cart");
    cartBtn.type = "button";
    cartBtn.addEventListener("click", function () {
        addToCart(cartBtn, product);
    });


    actions.appendChild(buyBtn);
    actions.appendChild(cartBtn);
    card.appendChild(actions);


    return card;
}


function renderProducts() {
    if (!trackEl) return;
    trackEl.innerHTML = "";


    const list = products.filter(function (p) {
        return currentCategory === "All" || p.category === currentCategory;
    });


    if (list.length === 0) {
        trackEl.appendChild(el("p", "empty-note", "No products in this category yet."));
    } else {
        list.forEach(function (p) {
            trackEl.appendChild(buildProductCard(p));
        });
    }


    if (loopEl) loopEl.scrollLeft = 0;
}


function setCategory(name) {
    currentCategory = name;
    document.querySelectorAll(".cat-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.category === name);
    });
    renderProducts();
}


document.querySelectorAll(".cat-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        setCategory(btn.dataset.category);
    });
});


document.querySelectorAll(".buy[data-go]").forEach(function (link) {
    link.addEventListener("click", function () {
        setCategory(link.dataset.go);
    });
});


// direction: 1 = next, -1 = previous. Wraps around at either end.
function scrollProducts(direction) {
    if (!loopEl) return;
    const card = trackEl.querySelector(".product-card");
    const step = card ? card.offsetWidth + CARD_GAP : 320;
    const max = loopEl.scrollWidth - loopEl.clientWidth;


    if (direction > 0 && loopEl.scrollLeft >= max - 4) {
        loopEl.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && loopEl.scrollLeft <= 4) {
        loopEl.scrollTo({ left: max, behavior: "smooth" });
    } else {
        loopEl.scrollBy({ left: direction * step, behavior: "smooth" });
    }
}


const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
if (prevBtn) prevBtn.addEventListener("click", function () { scrollProducts(-1); });
if (nextBtn) nextBtn.addEventListener("click", function () { scrollProducts(1); });


renderProducts();


/* ===== Checkout popup ===== */
const backdrop = document.getElementById("checkoutBackdrop");
const checkoutProductEl = document.getElementById("checkoutProduct");
const checkoutForm = document.getElementById("checkoutForm");
const quantityInput = document.getElementById("orderQuantity");
const totalEl = document.getElementById("checkoutTotal");
let selectedProduct = null;
let cartMode = false;


function getQty() {
    if (cartMode) return 1;
    let qty = parseInt(quantityInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    return qty;
}


function updateTotal() {
    if (!selectedProduct || !totalEl) return;
    totalEl.textContent = peso(selectedProduct.price * getQty());
}


function openCheckout(product, isCart) {
    if (!backdrop) return;
    cartMode = !!isCart;
    selectedProduct = product;


    checkoutProductEl.innerHTML = "";
    checkoutProductEl.appendChild(el("strong", "", product.name));
    checkoutProductEl.appendChild(el("span", "", cartMode ? "Cart total" : peso(product.price) + " each"));


    quantityInput.value = 1;
    quantityInput.disabled = cartMode;
    updateTotal();


    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("customerName").focus();
}


function closeCheckout() {
    if (!backdrop) return;
    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    selectedProduct = null;
    cartMode = false;
    quantityInput.disabled = false;
}


if (backdrop) {
    document.getElementById("closeCheckout").addEventListener("click", closeCheckout);


    backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) closeCheckout();
    });


    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && backdrop.classList.contains("show")) closeCheckout();
    });


    quantityInput.addEventListener("input", updateTotal);


    checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!selectedProduct) return;


        const qty = getQty();
        const wasCart = cartMode;


        const order = {
            id: "GH-" + Date.now().toString(36).toUpperCase(),
            date: new Date().toISOString(),
            product: selectedProduct.name,
            unitPrice: selectedProduct.price,
            quantity: qty,
            total: selectedProduct.price * qty,
            customerName: document.getElementById("customerName").value.trim(),
            customerPhone: document.getElementById("customerPhone").value.trim(),
            customerAddress: document.getElementById("customerAddress").value.trim(),
            paymentMethod: document.getElementById("paymentMethod").value
        };


        const orders = readJSON("gadgetHubOrders", []);
        orders.unshift(order);
        const saved = writeJSON("gadgetHubOrders", orders);


        checkoutForm.reset();
        closeCheckout();


        if (wasCart) {
            saveCart([]);
            renderCart();
        }


        renderOrders();


        if (saved) {
            showToast("Order placed! Number: " + order.id);
        } else {
            showToast("Order placed, but it could not be saved on this device.");
        }
    });
}



const ordersList = document.getElementById("ordersList");


function renderOrders() {
    if (!ordersList) return;
    const orders = readJSON("gadgetHubOrders", []);
    ordersList.innerHTML = "";


    if (orders.length === 0) {
        ordersList.appendChild(el("p", "empty-note", "You have no orders yet."));
        return;
    }


    orders.forEach(function (o) {
        const item = el("div", "order-item");
        item.appendChild(el("h3", "", o.product + " × " + o.quantity));
        item.appendChild(el("div", "order-meta",
            "Order " + o.id + " • " + new Date(o.date).toLocaleString("en-PH")));
        item.appendChild(el("div", "", "Name: " + o.customerName));
        item.appendChild(el("div", "", "Phone: " + o.customerPhone));
        item.appendChild(el("div", "", "Address: " + o.customerAddress));
        item.appendChild(el("div", "", "Payment: " + o.paymentMethod));
        item.appendChild(el("div", "order-total", "Total: " + peso(o.total)));
        ordersList.appendChild(item);
    });
}


const clearBtn = document.getElementById("clearOrders");
if (clearBtn) {
    clearBtn.addEventListener("click", function () {
        if (confirm("Delete all saved orders on this device?")) {
            try {
                localStorage.removeItem("gadgetHubOrders");
            } catch (error) { /* ignore */ }
            renderOrders();
        }
    });
}


renderOrders();

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        contactForm.reset();
        showToast("Thank you! We received your message.");
    });
}


function renderCart() {
    const cartList = document.getElementById("cartItemsList");
    const totalDisplay = document.getElementById("cartPageTotal");


    if (!cartList || !totalDisplay) return;


    const cart = getCart();
    cartList.innerHTML = "";
    let total = 0;


    if (cart.length === 0) {
        cartList.appendChild(el("p", "empty-note", "Your cart is empty."));
    }


    cart.forEach(function (item, index) {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const subtotal = price * quantity;
        total += subtotal;


        const row = el("div", "cart-item");


        if (item.image) {
            const img = el("img");
            img.src = item.image;
            img.alt = item.name || "Product";
            img.width = 80;
            row.appendChild(img);
        }


        row.appendChild(el("p", "", item.name));
        row.appendChild(el("p", "", peso(price) + " × " + quantity));
        row.appendChild(el("p", "", "Subtotal: " + peso(subtotal)));


        const removeBtn = el("button", "add-cart", "Remove");
        removeBtn.type = "button";
        removeBtn.addEventListener("click", function () {
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
        });
        row.appendChild(removeBtn);


        cartList.appendChild(row);
    });


    totalDisplay.textContent = peso(total);
}


const cartCheckoutBtn = document.getElementById("cartCheckout");
if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", function () {
        const cart = getCart();
        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }


        let total = 0;
        let itemCount = 0;
        const names = cart.map(function (item) {
            const q = Number(item.quantity) || 1;
            total += (Number(item.price) || 0) * q;
            itemCount += q;
            return item.name + " ×" + q;
        });


        openCheckout({
            name: "Cart (" + itemCount + " items): " + names.join(", "),
            price: total
        }, true);
    });
}


renderCart();



function goTo(hash) {
    const id = (hash || "home").replace("#", "");
    const target = document.getElementById("view-" + id) || document.getElementById(id);


    if (id === "home" || !target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const hash = link.getAttribute("href");
    history.replaceState(null, "", hash);
    goTo(hash);
});



window.addEventListener("hashchange", function () {
    goTo(location.hash);
});



window.addEventListener("load", function () {
    if (location.hash) {
        setTimeout(function () { goTo(location.hash); }, 100);
    }
});
