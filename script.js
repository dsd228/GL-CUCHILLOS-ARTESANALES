document.addEventListener('DOMContentLoaded', function() {
    console.log('GL CUCHILLOS ARTESANALES - Sitio completamente funcional');
    
    // ============================================
    // VARIABLES GLOBALES Y DATOS DE PRODUCTOS
    // ============================================
    let cart = [];
    let wishlist = [];
    
    // Base de datos de productos (simulada)
    const productsDB = {
        'chef-damasco': {
            id: 'p001',
            name: 'Chef Damasco',
            price: 24500,
            image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f',
            category: 'chef',
            description: 'Hoja de acero Damasco, mango de madera de olivo estabilizada',
            rating: 4.5,
            reviews: 42,
            stock: 15,
            tags: ['más vendido', 'premium']
        },
        'caza-tactico': {
            id: 'p002',
            name: 'Caza Táctico',
            price: 18900,
            image: 'https://images.unsplash.com/photo-1559678471-8e82abe50464',
            category: 'caza',
            description: 'Acero al carbono 1095, mango micarta con textura antideslizante',
            rating: 4.0,
            reviews: 28,
            stock: 8,
            tags: ['nuevo', 'táctico']
        },
        'juego-parrillero': {
            id: 'p003',
            name: 'Juego Parrillero',
            price: 32500,
            image: 'https://images.unsplash.com/photo-1557674200-8e0cdf6d6c95',
            category: 'parrilla',
            description: 'Set de 3 cuchillos + tenedor, acero inoxidable, mangos de nogal',
            rating: 5.0,
            reviews: 56,
            stock: 12,
            tags: ['oferta', 'combo']
        },
        'decorativo-damasco': {
            id: 'p004',
            name: 'Damasco Decorativo',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1548443768-8c6b8b8b8b8b',
            category: 'decorativo',
            description: 'Patrón damasco único, mango de asta de ciervo con incrustaciones',
            rating: 5.0,
            reviews: 19,
            stock: 3,
            tags: ['exclusivo', 'colección']
        }
    };
    
    // ============================================
    // ELEMENTOS DEL DOM
    // ============================================
    const elements = {
        menuToggle: document.querySelector('.menu-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        mobileOverlay: document.querySelector('.mobile-overlay'),
        closeMenu: document.querySelector('.close-menu'),
        
        searchBtn: document.querySelector('.search-btn'),
        searchBox: document.querySelector('.search-box'),
        searchInput: document.querySelector('.search-input'),
        searchSubmit: document.querySelector('.search-submit'),
        
        cartBtn: document.querySelector('.cart-btn'),
        cartSidebar: document.querySelector('.cart-sidebar'),
        cartOverlay: document.querySelector('.cart-overlay'),
        closeCart: document.querySelector('.close-cart'),
        cartCount: document.querySelector('.cart-count'),
        cartItems: document.querySelector('.cart-items'),
        cartTotal: document.querySelector('.total-price'),
        checkoutBtn: document.querySelector('.btn-checkout'),
        emptyCart: document.querySelector('.empty-cart'),
        
        wishlistBtn: document.querySelector('.wishlist-btn'),
        wishlistCount: document.querySelector('.wishlist-count'),
        
        mobileDropdowns: document.querySelectorAll('.mobile-dropdown'),
        addToCartBtns: document.querySelectorAll('.btn-add-cart'),
        wishlistBtns: document.querySelectorAll('.btn-wishlist'),
        
        heroActions: document.querySelectorAll('.hero-actions .btn'),
        categoryCards: document.querySelectorAll('.category-card'),
        viewAllBtn: document.querySelector('a[href="#"] .fa-arrow-right')?.closest('.btn'),
        
        newsletterForm: document.querySelector('.newsletter-form'),
        languageSelector: document.querySelector('.language-selector')
    };
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        console.log('Inicializando funcionalidades completas...');
        
        // Cargar datos del localStorage
        loadFromStorage();
        
        // Configurar todos los event listeners
        setupEventListeners();
        
        // Actualizar contadores
        updateCounters();
        
        // Renderizar carrito si hay items
        if (cart.length > 0) {
            renderCartItems();
        }
        
        // Añadir atributos data-id a los productos
        addProductDataAttributes();
        
        console.log('✅ Sitio completamente funcional');
        
        // Mostrar notificación de bienvenida
        setTimeout(() => {
            showNotification('✨ ¡Bienvenido a GL Cuchillos Artesanales!', 'info');
        }, 1000);
    }
    
    // ============================================
    // STORAGE MANAGEMENT
    // ============================================
    function loadFromStorage() {
        const savedCart = localStorage.getItem('gl_cart');
        const savedWishlist = localStorage.getItem('gl_wishlist');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log(`Carrito cargado: ${cart.length} productos`);
        }
        if (savedWishlist) {
            wishlist = JSON.parse(savedWishlist);
            console.log(`Wishlist cargada: ${wishlist.length} productos`);
        }
    }
    
    function saveToStorage() {
        localStorage.setItem('gl_cart', JSON.stringify(cart));
        localStorage.setItem('gl_wishlist', JSON.stringify(wishlist));
    }
    
    // ============================================
    // EVENT LISTENERS COMPLETOS
    // ============================================
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // 1. NAVEGACIÓN MOBILE
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        if (elements.closeMenu) {
            elements.closeMenu.addEventListener('click', closeMobileMenu);
        }
        
        if (elements.mobileOverlay) {
            elements.mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // 2. DROPDOWNS MOBILE
        elements.mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('a');
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });
        
        // 3. BÚSQUEDA AVANZADA
        if (elements.searchBtn) {
            elements.searchBtn.addEventListener('click', toggleSearch);
        }
        
        if (elements.searchSubmit) {
            elements.searchSubmit.addEventListener('click', handleSearch);
        }
        
        if (elements.searchInput) {
            elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }
        
        // Cerrar búsqueda al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (elements.searchBox && elements.searchBox.classList.contains('active')) {
                if (!elements.searchBox.contains(e.target) && !elements.searchBtn.contains(e.target)) {
                    closeSearch();
                }
            }
        });
        
        // 4. CARRITO COMPLETO
        if (elements.cartBtn) {
            elements.cartBtn.addEventListener('click', openCart);
        }
        
        if (elements.closeCart) {
            elements.closeCart.addEventListener('click', closeCart);
        }
        
        if (elements.cartOverlay) {
            elements.cartOverlay.addEventListener('click', closeCart);
        }
        
        if (elements.checkoutBtn) {
            elements.checkoutBtn.addEventListener('click', handleCheckout);
        }
        
        // 5. ACCIONES DE PRODUCTOS
        elements.addToCartBtns.forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
        
        elements.wishlistBtns.forEach(btn => {
            btn.addEventListener('click', handleWishlist);
        });
        
        // 6. WISHLIST
        if (elements.wishlistBtn) {
            elements.wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (wishlist.length > 0) {
                    showNotification(`Tienes ${wishlist.length} productos en favoritos`, 'info');
                } else {
                    showNotification('Agrega productos a favoritos', 'info');
                }
            });
        }
        
        // 7. BOTONES HERO
        elements.heroActions?.forEach(btn => {
            btn.addEventListener('click', handleHeroAction);
        });
        
        // 8. CATEGORÍAS
        elements.categoryCards?.forEach(card => {
            card.addEventListener('click', handleCategoryClick);
        });
        
        // 9. NEWSLETTER
        if (elements.newsletterForm) {
            elements.newsletterForm.addEventListener('submit', handleNewsletter);
        }
        
        // 10. SELECTOR DE IDIOMA
        if (elements.languageSelector) {
            elements.languageSelector.addEventListener('change', handleLanguageChange);
        }
        
        // 11. NAVEGACIÓN DESKTOP (hover dropdowns)
        setupDesktopDropdowns();
        
        // 12. CERRAR CON ESCAPE
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                closeSearch();
                closeCart();
            }
        });
        
        // 13. BOTÓN "VER TODOS LOS PRODUCTOS"
        if (elements.viewAllBtn) {
            elements.viewAllBtn.closest('.btn').addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Explora todos nuestros productos en la sección de Tienda', 'info');
                // Scroll suave a la tienda (simulado)
                document.querySelector('[href*="Tienda"]')?.click();
            });
        }
    }
    
    // ============================================
    // FUNCIONALIDADES DE INTERFAZ
    // ============================================
    function toggleMobileMenu() {
        elements.mobileMenu.classList.toggle('active');
        elements.mobileOverlay.classList.toggle('active');
        document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMobileMenu() {
        elements.mobileMenu.classList.remove('active');
        elements.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function toggleSearch() {
        elements.searchBox.classList.toggle('active');
        if (elements.searchBox.classList.contains('active')) {
            elements.searchInput.focus();
        }
    }
    
    function closeSearch() {
        elements.searchBox.classList.remove('active');
        elements.searchInput.value = '';
    }
    
    function handleSearch() {
        const query = elements.searchInput.value.trim();
        if (query) {
            showNotification(`Buscando: "${query}"`, 'info');
            // Simular búsqueda
            setTimeout(() => {
                closeSearch();
                showNotification(`Se encontraron 5 productos para "${query}"`, 'success');
            }, 500);
        }
    }
    
    function openCart() {
        elements.cartSidebar.classList.add('active');
        elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartItems();
    }
    
    function closeCart() {
        elements.cartSidebar.classList.remove('active');
        elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ============================================
    // FUNCIONALIDADES DE PRODUCTOS - COMPLETAS
    // ============================================
    function handleAddToCart(e) {
        const btn = e.currentTarget;
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productKey = getProductKey(productName);
        const productData = productsDB[productKey];
        
        if (!productData) {
            showNotification('Error: Producto no encontrado', 'error');
            return;
        }
        
        // Verificar stock
        if (productData.stock <= 0) {
            showNotification('Lo sentimos, este producto está agotado', 'error');
            return;
        }
        
        const product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: 1
        };
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity >= productData.stock) {
                showNotification(`Solo quedan ${productData.stock} unidades en stock`, 'warning');
                return;
            }
            existingItem.quantity += 1;
            showNotification(`Se aumentó la cantidad de ${product.name} (${existingItem.quantity} unidades)`, 'info');
        } else {
            cart.push(product);
            showNotification(`✅ ${product.name} añadido al carrito`, 'success');
        }
        
        updateCounters();
        saveToStorage();
        animateButton(btn);
        
        // Actualizar stock simulado
        productData.stock -= 1;
    }
    
    function handleWishlist(e) {
        const btn = e.currentTarget;
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productKey = getProductKey(productName);
        const productData = productsDB[productKey];
        
        if (!productData) return;
        
        const product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image
        };
        
        // Verificar si ya está en wishlist
        const existingIndex = wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            // Remover
            wishlist.splice(existingIndex, 1);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
            showNotification(`${product.name} removido de favoritos`, 'info');
        } else {
            // Agregar
            wishlist.push(product);
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification(`❤️ ${product.name} añadido a favoritos`, 'success');
        }
        
        updateCounters();
        saveToStorage();
        animateButton(btn);
    }
    
    function renderCartItems() {
        if (!elements.cartItems) return;
        
        if (cart.length === 0) {
            elements.emptyCart.style.display = 'block';
            elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="#productos" class="btn btn-primary">Ver Productos</a>
                </div>
            `;
            elements.cartTotal.textContent = '$0';
            return;
        }
        
        elements.emptyCart.style.display = 'none';
        
        let total = 0;
        let cartHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                            <button class="remove-btn" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">$${itemTotal.toLocaleString()}</div>
                    </div>
                </div>
            `;
        });
        
        elements.cartItems.innerHTML = cartHTML;
        elements.cartTotal.textContent = `$${total.toLocaleString()}`;
        
        // Agregar event listeners a los botones del carrito
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                updateQuantity(index, 1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                removeFromCart(index);
            });
        });
    }
    
    function updateQuantity(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            
            if (cart[index].quantity <= 0) {
                removeFromCart(index);
            } else {
                saveToStorage();
                updateCounters();
                renderCartItems();
                showNotification(`Cantidad actualizada: ${cart[index].name} (${cart[index].quantity})`, 'info');
            }
        }
    }
    
    function removeFromCart(index) {
        if (cart[index]) {
            const removedItem = cart.splice(index, 1)[0];
            showNotification(`${removedItem.name} removido del carrito`, 'info');
            saveToStorage();
            updateCounters();
            renderCartItems();
        }
    }
    
    function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Agrega productos al carrito antes de finalizar la compra', 'warning');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Simulación de checkout
        showNotification('🛒 Procesando tu pedido...', 'info');
        
        setTimeout(() => {
            showNotification(`✅ Pedido confirmado por $${total.toLocaleString()}`, 'success');
            
            // Limpiar carrito
            cart = [];
            saveToStorage();
            updateCounters();
            renderCartItems();
            closeCart();
            
            // Simular envío de email
            setTimeout(() => {
                showNotification('📧 Recibirás un email con los detalles de tu compra', 'info');
            }, 1500);
        }, 2000);
    }
    
    // ============================================
    // FUNCIONALIDADES ADICIONALES
    // ============================================
    function handleHeroAction(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        
        if (btn.textContent.includes('Colección')) {
            // Scroll a productos
            document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' });
            showNotification('Explorando nuestra colección', 'info');
        } else if (btn.textContent.includes('Proceso')) {
            // Scroll a proceso artesanal
            document.querySelector('#talleres')?.scrollIntoView({ behavior: 'smooth' });
            showNotification('Conoce nuestro proceso artesanal', 'info');
        }
    }
    
    function handleCategoryClick(e) {
        e.preventDefault();
        const card = e.currentTarget;
        const categoryName = card.querySelector('h3').textContent;
        
        showNotification(`Explorando categoría: ${categoryName}`, 'info');
        
        // Simular carga de productos de categoría
        setTimeout(() => {
            const count = card.querySelector('.category-count').textContent;
            showNotification(`${count} productos encontrados en ${categoryName}`, 'success');
        }, 500);
    }
    
    function handleNewsletter(e) {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email || !validateEmail(email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }
        
        // Simular suscripción
        showNotification('Suscribiendo a newsletter...', 'info');
        
        setTimeout(() => {
            showNotification('✅ ¡Gracias por suscribirte! Pronto recibirás nuestras novedades', 'success');
            emailInput.value = '';
            
            // Guardar en localStorage
            const subscribers = JSON.parse(localStorage.getItem('gl_newsletter') || '[]');
            subscribers.push({ email, date: new Date().toISOString() });
            localStorage.setItem('gl_newsletter', JSON.stringify(subscribers));
        }, 1000);
    }
    
    function handleLanguageChange(e) {
        const lang = e.target.value;
        
        if (lang === 'en') {
            showNotification('Changing to English - This feature is under development', 'info');
            // Aquí iría la lógica de internacionalización
        } else {
            showNotification('Cambiando a Español', 'info');
        }
    }
    
    function setupDesktopDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-menu').style.display = 'grid';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-menu').style.display = 'none';
            });
        });
    }
    
    // ============================================
    // UTILIDADES
    // ============================================
    function updateCounters() {
        // Actualizar contador del carrito
        const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);
        if (elements.cartCount) {
            elements.cartCount.textContent = cartTotal;
            elements.cartCount.style.display = cartTotal > 0 ? 'flex' : 'none';
        }
        
        // Actualizar contador de wishlist
        if (elements.wishlistCount) {
            elements.wishlistCount.textContent = wishlist.length;
            elements.wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
        }
    }
    
    function addProductDataAttributes() {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.dataset.id = `p00${index + 1}`;
        });
    }
    
    function getProductKey(productName) {
        const keys = {
            'Chef Damasco': 'chef-damasco',
            'Caza Táctico': 'caza-tactico',
            'Juego Parrillero': 'juego-parrillero',
            'Damasco Decorativo': 'decorativo-damasco'
        };
        return keys[productName] || productName.toLowerCase().replace(/\s+/g, '-');
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // ============================================
    // NOTIFICACIONES MEJORADAS
    // ============================================
    function showNotification(message, type = 'info') {
        // Remover notificaciones anteriores
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Estilos dinámicos
        const colors = {
            success: '#38A169',
            error: '#E53E3E',
            warning: '#D69E2E',
            info: '#8B4513'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || '#8B4513'};
            color: white;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            overflow: hidden;
            font-family: var(--font-body);
        `;
        
        document.body.appendChild(notification);
        
        // Estilos del contenido
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 1rem 1.5rem;
            font-weight: 500;
        `;
        
        // Estilos del botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: rgba(255,255,255,0.7);
            margin-left: auto;
            cursor: pointer;
            font-size: 0.875rem;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.color = 'white';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = 'rgba(255,255,255,0.7)';
        });
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Mostrar con animación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Ocultar automáticamente después de 5 segundos
        const autoHide = setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Cancelar auto-hide al hover
        notification.addEventListener('mouseenter', () => {
            clearTimeout(autoHide);
        });
        
        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    init();
});
