// ==========================================
// GL CUCHILLOS - MODERN JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔪 GL CUCHILLOS ARTESANALES - Sitio cargado correctamente');
    
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    const state = {
        cart: [],
        wishlist: [],
        products: {
            'chef-damasco': {
                id: 'chef-damasco',
                name: 'Chef Damasco',
                price: 24500,
                category: 'Chef Profesional',
                image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=85'
            },
            'caza-tactico': {
                id: 'caza-tactico',
                name: 'Caza Táctico',
                price: 18900,
                category: 'Caza & Aventura',
                image: 'https://images.unsplash.com/photo-1559678471-8e82abe50464?w=600&q=85'
            },
            'juego-parrillero': {
                id: 'juego-parrillero',
                name: 'Juego Parrillero',
                price: 32500,
                category: 'Parrilla & Asado',
                image: 'https://images.unsplash.com/photo-1557674200-8e0cdf6d6c95?w=600&q=85'
            },
            'decorativo-damasco': {
                id: 'decorativo-damasco',
                name: 'Damasco Decorativo',
                price: 42000,
                category: 'Pieza de Colección',
                image: 'https://images.unsplash.com/photo-1595838698419-51a55cf9aa90?w=600&q=85'
            }
        }
    };
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const elements = {
        nav: document.getElementById('nav'),
        menuToggle: document.getElementById('menuToggle'),
        navMenu: document.getElementById('navMenu'),
        cartBtn: document.getElementById('cartBtn'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartClose: document.getElementById('cartClose'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartCount: document.getElementById('cartCount'),
        cartItems: document.getElementById('cartItems'),
        cartTotal: document.getElementById('cartTotal'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        addToCartBtns: document.querySelectorAll('.btn-add-cart'),
        wishlistBtns: document.querySelectorAll('.btn-wishlist'),
        navLinks: document.querySelectorAll('.nav-link')
    };
    
    // ==========================================
    // NAVIGATION
    // ==========================================
    
    // Sticky Navigation
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            elements.nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !elements.nav.classList.contains('scroll-down')) {
            // Scroll Down
            elements.nav.classList.remove('scroll-up');
            elements.nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && elements.nav.classList.contains('scroll-down')) {
            // Scroll Up
            elements.nav.classList.remove('scroll-down');
            elements.nav.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile Menu Toggle
    if (elements.menuToggle && elements.navMenu) {
        elements.menuToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
            elements.menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.navMenu.classList.remove('active');
            elements.menuToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = elements.nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // ==========================================
    // CART FUNCTIONALITY
    // ==========================================
    
    function openCart() {
        elements.cartSidebar.classList.add('active');
        elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        elements.cartSidebar.classList.remove('active');
        elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', openCart);
    }
    
    if (elements.cartClose) {
        elements.cartClose.addEventListener('click', closeCart);
    }
    
    if (elements.cartOverlay) {
        elements.cartOverlay.addEventListener('click', closeCart);
    }
    
    // Add to Cart
    elements.addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.product;
            const product = state.products[productId];
            
            if (!product) return;
            
            // Check if product already in cart
            const existingItem = state.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification('Producto agregado al carrito', 'success');
            
            // Animation
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Agregado
            `;
            
            setTimeout(() => {
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Agregar
                `;
            }, 2000);
        });
    });
    
    function updateCart() {
        updateCartCount();
        renderCartItems();
        updateCartTotal();
        saveCart();
    }
    
    function updateCartCount() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            elements.cartCount.style.display = 'flex';
        } else {
            elements.cartCount.style.display = 'none';
        }
    }
    
    function renderCartItems() {
        if (state.cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <p>Tu carrito está vacío</p>
                    <a href="#coleccion" class="btn btn-primary">Explorar Productos</a>
                </div>
            `;
            return;
        }
        
        elements.cartItems.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-price">$${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart('${item.id}')" aria-label="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    function updateCartTotal() {
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.cartTotal.textContent = `$${formatPrice(total)}`;
    }
    
    window.changeQuantity = function(productId, change) {
        const item = state.cart.find(i => i.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        updateCart();
    };
    
    window.removeFromCart = function(productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
        updateCart();
        showNotification('Producto eliminado del carrito', 'info');
    };
    
    // Checkout
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', () => {
            if (state.cart.length === 0) {
                showNotification('El carrito está vacío', 'warning');
                return;
            }
            
            const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const items = state.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
            
            const message = `Hola! Me gustaría consultar por los siguientes productos:\n\n${items}\n\nTotal: $${formatPrice(total)}`;
            const whatsappUrl = `https://wa.me/5493843458340?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // ==========================================
    // WISHLIST FUNCTIONALITY
    // ==========================================
    
    elements.wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.product;
            
            if (this.classList.contains('active')) {
                if (!state.wishlist.includes(productId)) {
                    state.wishlist.push(productId);
                }
                showNotification('Agregado a favoritos', 'success');
                
                // Change icon to filled heart
                this.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                `;
            } else {
                state.wishlist = state.wishlist.filter(id => id !== productId);
                showNotification('Eliminado de favoritos', 'info');
                
                // Change icon to outline heart
                this.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                `;
            }
            
            saveWishlist();
        });
    });
    
    // ==========================================
    // LOCAL STORAGE
    // ==========================================
    
    function saveCart() {
        localStorage.setItem('gl-cart', JSON.stringify(state.cart));
    }
    
    function loadCart() {
        const saved = localStorage.getItem('gl-cart');
        if (saved) {
            state.cart = JSON.parse(saved);
            updateCart();
        }
    }
    
    function saveWishlist() {
        localStorage.setItem('gl-wishlist', JSON.stringify(state.wishlist));
    }
    
    function loadWishlist() {
        const saved = localStorage.getItem('gl-wishlist');
        if (saved) {
            state.wishlist = JSON.parse(saved);
            
            // Update UI
            state.wishlist.forEach(productId => {
                const card = document.querySelector(`[data-product="${productId}"]`);
                if (card) {
                    const wishlistBtn = card.querySelector('.btn-wishlist');
                    if (wishlistBtn) {
                        wishlistBtn.classList.add('active');
                        wishlistBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        `;
                    }
                }
            });
        }
    }
    
    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: white;
            color: var(--text);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid var(--success);
        }
        
        .notification-error {
            border-left: 4px solid var(--error);
        }
        
        .notification-warning {
            border-left: 4px solid var(--warning);
        }
        
        .notification-info {
            border-left: 4px solid var(--accent);
        }
        
        .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: var(--radius-md);
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-name {
            font-size: 1rem;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-category {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }
        
        .cart-item-price {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--accent);
        }
        
        .cart-item-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-end;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--bg-soft);
            border-radius: var(--radius-md);
            padding: 0.25rem;
        }
        
        .qty-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            color: var(--primary);
            border-radius: var(--radius-sm);
            font-weight: 600;
            transition: all 0.2s;
        }
        
        .qty-btn:hover {
            background: var(--accent);
            color: white;
        }
        
        .qty-value {
            min-width: 30px;
            text-align: center;
            font-weight: 600;
        }
        
        .btn-remove {
            color: var(--text-muted);
            transition: color 0.2s;
        }
        
        .btn-remove:hover {
            color: var(--error);
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // ==========================================
    // UTILITIES
    // ==========================================
    
    function formatPrice(price) {
        return price.toLocaleString('es-AR');
    }
    
    // ==========================================
    // ANIMATIONS
    // ==========================================
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.product-card, .feature-card, .process-step, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .product-card,
        .feature-card,
        .process-step,
        .testimonial-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyles);
    
    // ==========================================
    // INITIALIZE
    // ==========================================
    
    loadCart();
    loadWishlist();
    
    console.log('✅ Todas las funcionalidades cargadas correctamente');
});
