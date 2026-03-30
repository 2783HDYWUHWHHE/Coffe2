// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Classic Espresso",
        category: "hot",
        price: 4.50,
        originalPrice: null,
        image: "images/coffee1.png",
        description: "Rich, bold, and full-bodied. A classic double shot of espresso with golden crema.",
        rating: 4.9,
        reviews: 328,
        badge: "popular"
    },
    {
        id: 2,
        name: "Iced Caramel Macchiato",
        category: "cold",
        price: 6.50,
        originalPrice: 7.99,
        image: "images/coffee2.png",
        description: "Velvety smooth espresso with layers of caramel and cold milk over ice.",
        rating: 4.8,
        reviews: 245,
        badge: "popular"
    },
    {
        id: 3,
        name: "Artisan Cappuccino",
        category: "hot",
        price: 5.50,
        originalPrice: null,
        image: "images/coffee3.png",
        description: "Perfectly steamed milk paired with rich espresso, topped with intricate latte art.",
        rating: 4.7,
        reviews: 189,
        badge: null
    },
    {
        id: 4,
        name: "Cold Brew Supreme",
        category: "cold",
        price: 5.99,
        originalPrice: null,
        image: "images/coffee4.png",
        description: "Smooth, naturally sweet cold brew steeped for 24 hours. A refreshing delight.",
        rating: 4.9,
        reviews: 412,
        badge: "new"
    },
    {
        id: 5,
        name: "Belgian Mocha",
        category: "specialty",
        price: 7.50,
        originalPrice: 8.99,
        image: "images/coffee5.png",
        description: "Luxurious blend of premium espresso and Belgian chocolate, crowned with whipped cream.",
        rating: 4.8,
        reviews: 276,
        badge: "popular"
    },
    {
        id: 6,
        name: "Signature Americano",
        category: "hot",
        price: 4.00,
        originalPrice: null,
        image: "images/coffee6.png",
        description: "A smooth, clean espresso diluted with hot water. Simple, elegant, perfect.",
        rating: 4.6,
        reviews: 198,
        badge: null
    }
];

// ===== Cart State =====
let cart = JSON.parse(localStorage.getItem('brewBeanCart')) || [];

// ===== DOM Elements =====
const productsGrid = document.getElementById('productsGrid');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartHeaderCount = document.getElementById('cartHeaderCount');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const scrollTopBtn = document.getElementById('scrollTop');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');

// ===== Render Products =====
function renderProducts(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    productsGrid.innerHTML = filtered.map((product, index) => `
        <div class="product-card fade-in" data-category="${product.category}" style="animation-delay: ${index * 0.1}s">
            ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badge === 'popular' ? '🔥 Popular' : '✨ New'}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-image-overlay"></div>
                <button class="quick-add" onclick="addToCart(${product.id})" id="quick-add-${product.id}">
                    + Add to Cart
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryLabel(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        $${product.price.toFixed(2)}
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" id="add-btn-${product.id}" aria-label="Add ${product.name} to cart">
                        +
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Trigger fade-in animations
    requestAnimationFrame(() => {
        document.querySelectorAll('.product-card.fade-in').forEach(card => {
            card.classList.add('visible');
        });
    });
}

function getCategoryLabel(category) {
    const labels = { hot: 'Hot Coffee', cold: 'Cold Drink', specialty: 'Specialty' };
    return labels[category] || category;
}

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ===== Cart Functions =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(product.name);

    // Button animation
    const btn = document.getElementById(`add-btn-${productId}`);
    if (btn) {
        btn.style.transform = 'rotate(90deg) scale(1.2)';
        btn.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))';
        btn.style.color = 'var(--color-bg)';
        btn.style.borderColor = 'transparent';
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('brewBeanCart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update counts
    cartCount.textContent = totalItems;
    cartHeaderCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

    // Animate cart count
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => cartCount.style.transform = 'scale(1)', 200);

    // Show/hide empty state & footer
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        renderCartItems();
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        renderCartItems();
        cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function renderCartItems() {
    const existingEmpty = cartItems.querySelector('.cart-empty');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty" id="cartEmpty">
                <div class="cart-empty-icon">🛒</div>
                <h4>Your cart is empty</h4>
                <p>Browse our menu and add some delicious coffee!</p>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Remove item">🗑</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItemEl);
    });
}

// ===== Cart Toggle =====
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartFn() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);
cartOverlay.addEventListener('click', closeCartFn);

// Close cart with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartFn();
});

// ===== Toast Notification =====
let toastTimeout;
function showToast(productName) {
    clearTimeout(toastTimeout);
    toastMessage.innerHTML = `
        <strong>${productName}</strong> added to cart!
        <span>View your cart to checkout</span>
    `;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Filter Products =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll to top button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Active nav link
    updateActiveNavLink();
});

// ===== Mobile Menu =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ===== Scroll to Top =====
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Fade-in Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initScrollAnimations() {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== Newsletter Form =====
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    if (email) {
        showToastCustom('🎉 Subscribed!', `We'll send updates to ${email}`);
        newsletterForm.reset();
    }
});

function showToastCustom(title, message) {
    clearTimeout(toastTimeout);
    toastMessage.innerHTML = `
        <strong>${title}</strong>
        <span>${message}</span>
    `;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== Checkout Button =====
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showToastCustom('🎉 Order Placed!', `Total: $${total.toFixed(2)} — Thank you for your order!`);

    cart = [];
    saveCart();
    updateCartUI();
    setTimeout(closeCartFn, 1000);
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    initScrollAnimations();
});
