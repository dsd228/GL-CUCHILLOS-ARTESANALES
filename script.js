document.addEventListener('DOMContentLoaded', function() {
    console.log('GL CUCHILLOS ARTESANALES - Sitio completamente funcional y responsive');
    
    // ============================================
    // VARIABLES GLOBALES Y DATOS
    // ============================================
    let cart = [];
    let wishlist = [];
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Base de datos de productos
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
        languageSelector: document.querySelector('.language-selector'),
        
        // Nuevos elementos para responsive
        dropdowns: document.querySelectorAll('.dropdown'),
        allInputs: document.querySelectorAll('input, select, textarea')
    };
    
    // ============================================
    // INICIALIZACIÓN COMPLETA
    // ============================================
    function init() {
        console.log('Inicializando funcionalidades completas...');
        // ============================================
// FUNCIONALIDAD PARA VER DETALLES DE PRODUCTO
// ============================================

function setupProductDetails() {
    const detailButtons = document.querySelectorAll('.btn-details');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            
            // Aquí puedes implementar la navegación a una página de detalle
            // Por ahora mostramos un modal/notificación
            const productNames = {
                'caza-tactico': 'Caza Táctico',
                'chef-parrillero': 'Chef Parrillero',
                'juego-parrillero-m': 'Juego Parrillero M',
                'verijero': 'Verijero',
                'caza-campo': 'Caza de Campo',
                'coleccionista': 'Modelo Coleccionista'
            };
            
            showNotification(`Viendo detalles de: ${productNames[productId]}`, 'info');
            
            // Scroll a la sección de detalles si existe
            const detailSection = document.getElementById('producto-detalle');
            if (detailSection) {
                detailSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// INICIALIZACIÓN DE NUEVAS FUNCIONALIDADES
// ============================================

function initNewSections() {
    console.log('Inicializando nuevas secciones...');
    
    // Configurar filtros de productos
    setupProductFilters();
    
    // Configurar botones de servicios
    setupServices();
    
    // Configurar botones de ver detalles
    setupProductDetails();
    
    // Añadir estilos iniciales para animaciones
    const productCards = document.querySelectorAll('.product-card-full');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Animar entrada de productos
    setTimeout(() => {
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// ============================================
// INTEGRAR CON TU CÓDIGO EXISTENTE
// ============================================

// En tu función init() existente, agregar:
function init() {
    // ... tu código existente ...
    
    // Después de inicializar todo, agregar:
    initNewSections();
    
    // ... resto de tu código ...
}

        // Cargar datos del localStorage
        loadFromStorage();
        
        // Configurar todos los event listeners
        setupEventListeners();
        
        // Inicializar funcionalidades responsive
        initResponsive();
        
        // Actualizar contadores
        updateCounters();
        
        // Renderizar carrito si hay items
        if (cart.length > 0) {
            renderCartItems();
        }
        
        // Añadir atributos data-id a los productos
        addProductDataAttributes();
        
        // Configurar dropdowns desktop
        setupDesktopDropdowns();
        
        console.log('✅ Sitio completamente funcional y responsive');
        
        // Mostrar notificación de bienvenida
        setTimeout(() => {
            showNotification('✨ ¡Bienvenido a GL Cuchillos Artesanales!', 'info');
        }, 1000);
    }
    
    // ============================================
    // FUNCIONALIDADES RESPONSIVE
    // ============================================
    function initResponsive() {
        // Configurar altura del viewport
        setViewportHeight();
        
        // Prevenir zoom en iOS
        preventIOSZoom();
        
        // Configurar eventos según dispositivo
        setupResponsiveEvents();
        
        // Swipe gestures para móvil
        if (isTouchDevice) {
            setupSwipeGestures();
        }
        
        // Escuchar cambios de orientación
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', debounce(setViewportHeight, 250));
        
        // Escuchar cambios en el teclado virtual
        window.addEventListener('resize', handleVirtualKeyboard);
    }
    
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    function preventIOSZoom() {
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'SELECT' || 
                e.target.tagName === 'TEXTAREA') {
                // Ya manejado por CSS
            }
        }, { passive: true });
    }
    
    function setupResponsiveEvents() {
        // Ajustar eventos según dispositivo
        if (isTouchDevice) {
            elements.allInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    // Scroll suave al input
                    setTimeout(() => {
                        input.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                });
            });
        }
    }
    
    function setupSwipeGestures() {
        let startX, startY;
        let isSwiping = false;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 10) {
                isSwiping = true;
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY || !isSwiping) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Solo considerar swipe horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe izquierda - cerrar carrito si está abierto
                    if (elements.cartSidebar.classList.contains('active')) {
                        closeCart();
                    }
                } else {
                    // Swipe derecha - cerrar menú si está abierto
                    if (elements.mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            }
            
            startX = null;
            startY = null;
            isSwiping = false;
        }, { passive: true });
    }
    
    function handleOrientationChange() {
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isPortrait) {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        } else {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        }
        
        // Recalcular altura del viewport
        setViewportHeight();
    }
    
    function handleVirtualKeyboard() {
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            // Scroll al input activo
            document.activeElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
            elements.menuToggle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                toggleMobileMenu();
            }, { passive: false });
        }
        
        if (elements.closeMenu) {
            elements.closeMenu.addEventListener('click', closeMobileMenu);
        }
        
        if (elements.mobileOverlay) {
            elements.mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // 2. DROPDOWNS MOBILE (SOLO 2)
        elements.mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('a');
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
                
                // Cerrar otros dropdowns
                elements.mobileDropdowns.forEach(other => {
                    if (other !== dropdown && other.classList.contains('active')) {
                        other.classList.remove('active');
                    }
                });
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
            // Agregar evento táctil para mejor feedback
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });
            btn.addEventListener('touchend', () => {
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
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
        
        // 11. CERRAR CON ESCAPE
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                closeSearch();
                closeCart();
            }
        });
        
        // 12. BOTÓN "VER TODOS LOS PRODUCTOS"
        if (elements.viewAllBtn) {
            elements.viewAllBtn.closest('.btn').addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Explora todos nuestros productos en la sección de Tienda', 'info');
                // Scroll suave a la tienda
                document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // 13. CERRAR DROPDOWNS AL HACER CLIC FUERA (MOBILE)
        document.addEventListener('click', (e) => {
            elements.mobileDropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('active') && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // 14. PREVENIR CLIC EN ENLACES VACÍOS
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Esta sección está en desarrollo', 'info');
            });
        });
    }
    
    function setupDesktopDropdowns() {
        elements.dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            
            dropdown.addEventListener('mouseenter', () => {
                menu.style.display = 'grid';
                setTimeout(() => {
                    menu.style.opacity = '1';
                    menu.style.transform = 'translateY(0)';
                }, 10);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 200);
            });
            
            // Inicializar estilos
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-10px)';
            menu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        });
    }
    
    // ============================================
    // FUNCIONALIDADES DE INTERFAZ
    // ============================================
    function toggleMobileMenu() {
        const isActive = elements.mobileMenu.classList.toggle('active');
        elements.mobileOverlay.classList.toggle('active');
        elements.menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        // Feedback táctil
        if (isTouchDevice) {
            elements.menuToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                elements.menuToggle.style.transform = '';
            }, 150);
        }
    }
    
    function closeMobileMenu() {
        elements.mobileMenu.classList.remove('active');
        elements.mobileOverlay.classList.remove('active');
        elements.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Cerrar todos los dropdowns mobile
        elements.mobileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    function toggleSearch() {
        const isActive = elements.searchBox.classList.toggle('active');
        if (isActive) {
            elements.searchInput.focus();
            // Agregar clase al body para prevenir scroll
            document.body.classList.add('search-open');
        } else {
            document.body.classList.remove('search-open');
        }
    }
    
    function closeSearch() {
        elements.searchBox.classList.remove('active');
        elements.searchInput.value = '';
        document.body.classList.remove('search-open');
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
        
        // Si el carrito está abierto, actualizar
        if (elements.cartSidebar.classList.contains('active')) {
            renderCartItems();
        }
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
            btn.setAttribute('aria-label', 'Agregar a favoritos');
            showNotification(`${product.name} removido de favoritos`, 'info');
        } else {
            // Agregar
            wishlist.push(product);
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.setAttribute('aria-label', 'Remover de favoritos');
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
                        <img src="${item.image}" alt="${item.name}" loading="lazy" width="80" height="80">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}" aria-label="Disminuir cantidad">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}" aria-label="Aumentar cantidad">+</button>
                            <button class="remove-btn" data-index="${index}" aria-label="Eliminar producto">
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
        
        // Mostrar loading en el botón
        elements.checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        elements.checkoutBtn.disabled = true;
        
        setTimeout(() => {
            showNotification(`✅ Pedido confirmado por $${total.toLocaleString()}`, 'success');
            
            // Limpiar carrito
            cart = [];
            saveToStorage();
            updateCounters();
            renderCartItems();
            
            // Resetear botón
            elements.checkoutBtn.innerHTML = 'Finalizar Compra';
            elements.checkoutBtn.disabled = false;
            
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
            emailInput.focus();
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
        if (!isTouchDevice) {
            // Animación para desktop
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        } else {
            // Feedback táctil
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 150);
        }
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
                <button class="notification-close" aria-label="Cerrar notificación"><i class="fas fa-times"></i></button>
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
            max-width: 90vw;
            width: 350px;
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
            min-width: 24px;
            min-height: 24px;
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
// ============================================
// FUNCIONALIDAD PARA FILTROS DE PRODUCTOS
// ============================================

function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card-full');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar productos
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Mostrar notificación
            const filterNames = {
                'all': 'todos los productos',
                'caza': 'cuchillos de caza',
                'parrilla': 'cuchillos parrilleros',
                'decorativos': 'cuchillos decorativos'
            };
            
            if (filterValue !== 'all') {
                showNotification(`Mostrando ${filterNames[filterValue]}`, 'info');
            }
        });
    });
}

// ============================================
// FUNCIONALIDAD PARA SERVICIOS
// ============================================

function setupServices() {
    const serviceButtons = document.querySelectorAll('.btn-service');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceNames = {
                'personalizacion': 'Personalización Total',
                'afilado': 'Afilado Profesional',
                'reparacion': 'Reparación y Restauración',
                'asesoria': 'Asesoría Técnica'
            };
            
            // Mostrar modal de servicio (puedes implementar esto después)
            showServiceModal(serviceType, serviceNames[serviceType]);
            
            // Notificación temporal
            showNotification(`Solicitud enviada para: ${serviceNames[serviceType]}`, 'success');
        });
    });
}

function showServiceModal(serviceType, serviceName) {
    // Aquí puedes implementar un modal más adelante
    // Por ahora redirigimos a WhatsApp con un mensaje predeterminado
    const message = `Hola, me interesa el servicio de ${serviceName}. ¿Podrían darme más información?`;
    const encodedMessage = encodeURIComponent(message);
    
    // Usar setTimeout para que primero se vea la notificación
    setTimeout(() => {
        window.open(`https://wa.me/5493843458340?text=${encodedMessage}`, '_blank');
    }, 1000);
}

