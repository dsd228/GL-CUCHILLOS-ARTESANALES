document.addEventListener('DOMContentLoaded', function() {
    console.log('GL CUCHILLOS ARTESANALES - Sitio cargado');
    
    // ============================================
    // VARIABLES GLOBALES
    // ============================================
    let cart = [];
    let wishlist = [];
    
    // ============================================
    // ELEMENTOS DEL DOM
    // ============================================
    const elements = {
        // Navegación mobile
        menuToggle: document.querySelector('.menu-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        mobileOverlay: document.querySelector('.mobile-overlay'),
        closeMenu: document.querySelector('.close-menu'),
        
        // Búsqueda
        searchBtn: document.querySelector('.search-btn'),
        searchBox: document.querySelector('.search-box'),
        searchInput: document.querySelector('.search-input'),
        
        // Carrito
        cartBtn: document.querySelector('.cart-btn'),
        cartSidebar: document.querySelector('.cart-sidebar'),
        cartOverlay: document.querySelector('.cart-overlay'),
        closeCart: document.querySelector('.close-cart'),
        cartCount: document.querySelector('.cart-count'),
        
        // Wishlist
        wishlistBtn: document.querySelector('.wishlist-btn'),
        wishlistCount: document.querySelector('.wishlist-count'),
        
        // Dropdowns mobile
        mobileDropdowns: document.querySelectorAll('.mobile-dropdown'),
        
        // Productos
        addToCartBtns: document.querySelectorAll('.btn-add-cart'),
        wishlistBtns: document.querySelectorAll('.btn-wishlist')
    };
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        loadFromStorage();
        setupEventListeners();
        updateCounters();
        
        // Añadir skeleton loading para imágenes
        setupLazyLoading();
        
        console.log('Sitio inicializado correctamente');
    }
    
    // ============================================
    // STORAGE MANAGEMENT
    // ============================================
    function loadFromStorage() {
        const savedCart = localStorage.getItem('gl_cart');
        const savedWishlist = localStorage.getItem('gl_wishlist');
        
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    }
    
    function saveToStorage() {
        localStorage.setItem('gl_cart', JSON.stringify(cart));
        localStorage.setItem('gl_wishlist', JSON.stringify(wishlist));
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    function setupEventListeners() {
        // Menú mobile
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        if (elements.closeMenu) {
            elements.closeMenu.addEventListener('click', closeMobileMenu);
        }
        
        if (elements.mobileOverlay) {
            elements.mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Dropdowns mobile
        elements.mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('a');
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });
        
        // Búsqueda
        if (elements.searchBtn) {
            elements.searchBtn.addEventListener('click', toggleSearch);
        }
        
        // Cerrar búsqueda al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (elements.searchBox && elements.searchBox.classList.contains('active')) {
                if (!elements.searchBox.contains(e.target) && !elements.searchBtn.contains(e.target)) {
                    closeSearch();
                }
            }
        });
        
        // Carrito
        if (elements.cartBtn) {
            elements.cartBtn.addEventListener('click', openCart);
        }
        
        if (elements.closeCart) {
            elements.closeCart.addEventListener('click', closeCart);
        }
        
        if (elements.cartOverlay) {
            elements.cartOverlay.addEventListener('click', closeCart);
        }
        
        // Añadir al carrito
        elements.addToCartBtns.forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
        
        // Wishlist
        elements.wishlistBtns.forEach(btn => {
            btn.addEventListener('click', handleWishlist);
        });
        
        if (elements.wishlistBtn) {
            elements.wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('La función de favoritos estará disponible pronto', 'info');
            });
        }
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                closeSearch();
                closeCart();
            }
        });
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
    }
    
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
    
    // ============================================
    // FUNCIONALIDADES DE PRODUCTOS
    // ============================================
    function handleAddToCart(e) {
        const btn = e.currentTarget;
        const productCard = btn.closest('.product-card');
        const productId = productCard.dataset.id || Date.now();
        
        const product = {
            id: productId,
            name: productCard.querySelector('.product-title').textContent,
            price: parseInt(productCard.querySelector('.current-price').textContent.replace('$', '').replace('.', '')),
            image: productCard.querySelector('img').src,
            quantity: 1
        };
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Se aumentó la cantidad de ${product.name}`, 'info');
        } else {
            cart.push(product);
            showNotification(`${product.name} añadido al carrito`, 'success');
        }
        
        updateCounters();
        saveToStorage();
        
        // Animación del botón
        animateButton(btn);
    }
    
    function handleWishlist(e) {
        const btn = e.currentTarget;
        const productCard = btn.closest('.product-card');
        const productId = productCard.dataset.id || Date.now();
        
        const product = {
            id: productId,
            name: productCard.querySelector('.product-title').textContent,
            price: productCard.querySelector('.current-price').textContent,
            image: productCard.querySelector('img').src
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
            showNotification(`${product.name} añadido a favoritos`, 'success');
        }
        
        updateCounters();
        saveToStorage();
        animateButton(btn);
    }
    
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
    
    // ============================================
    // ANIMACIONES Y FEEDBACK
    // ============================================
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        // Cerrar al hacer clic
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#38A169',
            error: '#E53E3E',
            warning: '#D69E2E',
            info: '#8B4513'
        };
        return colors[type] || '#8B4513';
    }
    
    // ============================================
    // LAZY LOADING
    // ============================================
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ============================================
    // INICIALIZAR
    // ============================================
    init();
});
