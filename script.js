document.addEventListener('DOMContentLoaded', function() {
    console.log('GL CUCHILLOS ARTESANALES - Inicializando aplicación...');
    
    // ============================================
    // SISTEMA DE PRODUCTOS
    // ============================================
    const products = [
        {
            id: 1,
            name: "Cuchillo Chef Damasco",
            price: 24500,
            category: "Cuchillos de Chef",
            image: "cuchillo1.jpg",
            description: "Hoja de acero Damasco, mango de madera de olivo",
            featured: true,
            inStock: true,
            rating: 4.8,
            reviews: 42,
            material: "Acero Damasco",
            handle: "Madera de Olivo"
        },
        {
            id: 2,
            name: "Cuchillo Caza Táctico",
            price: 18900,
            category: "Cuchillos de Caza",
            image: "cuchillo2.jpg",
            description: "Hoja de acero al carbono, mango micarta",
            featured: true,
            inStock: true,
            rating: 4.6,
            reviews: 28,
            material: "Acero al Carbono",
            handle: "Micarta"
        },
        {
            id: 3,
            name: "Cuchillo Parrillero",
            price: 12500,
            category: "Juegos",
            image: "cuchillo3.jpg",
            description: "Hoja inoxidable, mango de resina epoxi",
            featured: true,
            inStock: true,
            rating: 4.4,
            reviews: 56,
            material: "Acero Inoxidable",
            handle: "Resina Epoxi"
        },
        {
            id: 4,
            name: "Cuchillo Plegable",
            price: 15600,
            category: "Cuchillos",
            image: "cuchillo4.jpg",
            description: "Diseño compacto, hoja de acero inoxidable",
            featured: true,
            inStock: true,
            rating: 4.7,
            reviews: 31,
            material: "Acero Inoxidable",
            handle: "Aluminio"
        },
        {
            id: 5,
            name: "Juego 6 Cuchillos",
            price: 68500,
            category: "Juegos",
            image: "cuchillo5.jpg",
            description: "Set completo para cocina profesional",
            featured: true,
            inStock: true,
            rating: 4.9,
            reviews: 67,
            material: "Acero Inoxidable",
            handle: "Madera de Nogal"
        },
        {
            id: 6,
            name: "Cuchillo Decorativo",
            price: 32000,
            category: "Cuchillos",
            image: "cuchillo6.jpg",
            description: "Hoja Damasco, mango de asta con incrustaciones",
            featured: true,
            inStock: false,
            rating: 4.8,
            reviews: 19,
            material: "Acero Damasco",
            handle: "Asta con Incrustaciones"
        },
        {
            id: 7,
            name: "Mango Madera Nogal",
            price: 4500,
            category: "Mangos",
            image: "mango1.jpg",
            description: "Mango de madera de nogal para personalización",
            featured: false,
            inStock: true,
            rating: 4.5,
            reviews: 24,
            material: "Madera de Nogal",
            handle: null
        },
        {
            id: 8,
            name: "Mango Micarta Rojo",
            price: 3800,
            category: "Mangos",
            image: "mango2.jpg",
            description: "Mango de micarta color rojo, textura antideslizante",
            featured: false,
            inStock: true,
            rating: 4.3,
            reviews: 17,
            material: "Micarta",
            handle: null
        }
    ];

    // ============================================
    // ESTADO DE LA APLICACIÓN
    // ============================================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currency = localStorage.getItem('currency') || 'ARS';
    let language = localStorage.getItem('language') || 'es';
    let currentView = 'grid'; // 'grid' o 'list'

    // ============================================
    // ELEMENTOS DEL DOM
    // ============================================
    const elements = {
        // Productos
        productsGrid: document.getElementById('products-grid'),
        productCount: document.querySelector('.product-count'),
        
        // Carrito
        cartBtn: document.querySelector('.cart-btn'),
        cartSidebar: document.querySelector('.cart-sidebar'),
        cartOverlay: document.querySelector('.cart-overlay'),
        closeCartBtn: document.querySelector('.close-cart'),
        cartItems: document.querySelector('.cart-items'),
        cartCount: document.querySelector('.cart-count'),
        cartTotal: document.querySelector('.total-price'),
        checkoutBtn: document.querySelector('.btn-checkout'),
        
        // Favoritos
        favoritesBtn: document.querySelector('.favorites'),
        favoritesSidebar: document.querySelector('.favorites-sidebar'),
        favoritesOverlay: document.querySelector('.favorites-overlay'),
        closeFavoritesBtn: document.querySelector('.close-favorites'),
        favoritesItems: document.querySelector('.favorites-items'),
        favoritesCount: document.querySelector('.favorites-count'),
        
        // Login
        loginBtn: document.querySelector('.login-btn'),
        loginModal: document.querySelector('.login-modal'),
        loginOverlay: document.querySelector('.login-overlay'),
        closeLoginBtn: document.querySelector('.close-login'),
        loginForm: document.getElementById('login-form'),
        
        // Búsqueda
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button'),
        
        // Selectores
        currencySelector: document.querySelector('.currency-selector'),
        languageSelector: document.querySelector('.language-selector'),
        
        // Navegación
        menuToggle: document.querySelector('.menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        dropdowns: document.querySelectorAll('.dropdown'),
        
        // Controles de vista
        viewToggle: document.querySelector('.view-toggle'),
        sortSelect: document.querySelector('.sort-select'),
        filterBtn: document.querySelector('.filter-btn')
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        console.log('Inicializando aplicación...');
        
        // Cargar preferencias del usuario
        loadUserPreferences();
        
        // Renderizar productos
        renderProducts();
        
        // Actualizar contadores
        updateCartCount();
        updateFavoritesCount();
        
        // Cargar contenido dinámico
        loadCartItems();
        loadFavoritesItems();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Configurar accesibilidad
        setupAccessibility();
        
        console.log('Aplicación inicializada correctamente');
    }

    // ============================================
    // RENDERIZADO DE PRODUCTOS
    // ============================================
    function renderProducts(productsToRender = products.filter(p => p.featured)) {
        console.log(`Renderizando ${productsToRender.length} productos...`);
        
        if (!elements.productsGrid) {
            console.error('No se encontró el contenedor de productos');
            return;
        }
        
        // Mostrar skeleton loading
        showSkeletonLoading();
        
        // Simular carga asíncrona
        setTimeout(() => {
            elements.productsGrid.innerHTML = '';
            
            if (productsToRender.length === 0) {
                elements.productsGrid.innerHTML = `
                    <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="fas fa-search fa-3x mb-3" style="color: #ccc;"></i>
                        <h3>No se encontraron productos</h3>
                        <p class="text-medium">Intenta con otros términos de búsqueda</p>
                    </div>
                `;
                return;
            }
            
            productsToRender.forEach(product => {
                const productCard = createProductCard(product);
                elements.productsGrid.appendChild(productCard);
            });
            
            // Actualizar contador de productos
            if (elements.productCount) {
                elements.productCount.textContent = productsToRender.length;
            }
        }, 300);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-price', product.price);
        
        const isFavorite = favorites.some(fav => fav.id === product.id);
        const ratingStars = generateRatingStars(product.rating);
        const color = getRandomColor();
        
        card.innerHTML = `
            ${!product.inStock ? '<span class="badge badge-warning" style="position: absolute; top: 1rem; left: 1rem; z-index: 1;">Agotado</span>' : ''}
            <div class="product-img" style="background-color: #${color}; background-image: url('https://images.unsplash.com/photo-${getRandomUnsplashImage()}');"></div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-meta mb-2">
                    <span class="product-category">${product.category}</span>
                    <div class="product-rating">
                        ${ratingStars}
                        <small>(${product.reviews})</small>
                    </div>
                </div>
                <p class="product-description text-light mb-3">${product.description}</p>
                <div class="product-price mb-3">$${product.price.toLocaleString('es-AR')}</div>
                <div class="product-specs mb-3">
                    <small><strong>Material:</strong> ${product.material}</small><br>
                    <small><strong>Mango:</strong> ${product.handle || 'No aplica'}</small>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" ${!product.inStock ? 'disabled' : ''}
                            aria-label="Agregar ${product.name} al carrito">
                        ${product.inStock ? 
                            '<i class="fas fa-shopping-cart"></i> Agregar' : 
                            'Agotado'}
                    </button>
                    <button class="btn-favorite ${isFavorite ? 'active' : ''}"
                            aria-label="${isFavorite ? 'Eliminar de' : 'Agregar a'} favoritos">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners
        const addToCartBtn = card.querySelector('.btn-add-cart');
        const favoriteBtn = card.querySelector('.btn-favorite');
        
        if (product.inStock) {
            addToCartBtn.addEventListener('click', () => {
                addToCart(product);
                animateButton(addToCartBtn);
            });
        }
        
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(product, favoriteBtn);
            animateButton(favoriteBtn);
        });
        
        // Mejora de accesibilidad
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        return card;
    }

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    function generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    function getRandomColor() {
        const colors = ['8B4513', 'D2691E', 'A0522D', 'CD853F', 'A52A2A', '8B0000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getRandomUnsplashImage() {
        const images = [
            '1580618672591-eb180b1a973f',  // Cuchillo 1
            '1529693662656-7d4eaf3a6c84',  // Cuchillo 2
            '1573665805945-7d5f0a4c9a9c',  // Cuchillo 3
            '1556906780-5f7a8f5b5b5a',     // Cuchillo 4
            '1548443768-8c6b8b8b8b8b',     // Cuchillo 5
            '1529693662656-7d4eaf3a6c84',  // Cuchillo 6
            '1573665805945-7d5f0a4c9a9c',  // Mango 1
            '1556906780-5f7a8f5b5b5a'      // Mango 2
        ];
        return images[Math.floor(Math.random() * images.length)];
    }

    // ============================================
    // CARRITO DE COMPRAS
    // ============================================
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Cantidad aumentada: ${product.name}`, 'info');
        } else {
            cart.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
            showNotification(`¡${product.name} agregado al carrito!`, 'success');
        }
        
        updateCartCount();
        saveCart();
        loadCartItems();
        
        // Animar icono del carrito
        animateCartIcon();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (elements.cartCount) {
            elements.cartCount.textContent = totalItems;
            elements.cartCount.setAttribute('aria-label', `${totalItems} items en el carrito`);
        }
    }

    function loadCartItems() {
        const emptyCart = document.querySelector('.empty-cart');
        
        if (!elements.cartItems) return;
        
        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (elements.cartTotal) elements.cartTotal.textContent = '$0';
            elements.cartItems.innerHTML = '';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        elements.cartItems.innerHTML = '';
        
        let total = 0;
        
        // Ordenar por fecha de agregado (más reciente primero)
        const sortedCart = [...cart].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        
        sortedCart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-id', item.id);
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItem.innerHTML = `
                <div class="cart-item-img" style="background-color: #${getRandomColor()}"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-AR')} c/u</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" aria-label="Reducir cantidad">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" 
                                   class="quantity-input" 
                                   value="${item.quantity}" 
                                   min="1" 
                                   max="10"
                                   aria-label="Cantidad de ${item.name}">
                            <button class="quantity-btn plus" aria-label="Aumentar cantidad">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="d-flex align-center gap-2">
                            <span class="item-total">$${itemTotal.toLocaleString('es-AR')}</span>
                            <button class="remove-item" aria-label="Eliminar ${item.name} del carrito">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Event listeners
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const quantityInput = cartItem.querySelector('.quantity-input');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            minusBtn.addEventListener('click', () => updateQuantity(item.id, -1, quantityInput));
            plusBtn.addEventListener('click', () => updateQuantity(item.id, 1, quantityInput));
            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value) || 1;
                setQuantity(item.id, newQuantity, quantityInput);
            });
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            
            elements.cartItems.appendChild(cartItem);
        });
        
        if (elements.cartTotal) {
            elements.cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
        }
    }

    function updateQuantity(productId, change, inputElement) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            const newQuantity = item.quantity + change;
            
            if (newQuantity < 1) {
                removeFromCart(productId);
                return;
            }
            
            if (newQuantity > 10) {
                showNotification('Máximo 10 unidades por producto', 'warning');
                return;
            }
            
            item.quantity = newQuantity;
            inputElement.value = newQuantity;
            
            updateCartCount();
            saveCart();
            loadCartItems();
        }
    }

    function setQuantity(productId, quantity, inputElement) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity < 1 || quantity > 10) {
                inputElement.value = item.quantity;
                showNotification('La cantidad debe estar entre 1 y 10', 'warning');
                return;
            }
            
            item.quantity = quantity;
            updateCartCount();
            saveCart();
            loadCartItems();
        }
    }

    function removeFromCart(productId) {
        const item = cart.find(item => item.id === productId);
        cart = cart.filter(item => item.id !== productId);
        
        updateCartCount();
        saveCart();
        loadCartItems();
        
        if (item) {
            showNotification(`${item.name} eliminado del carrito`, 'info');
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // ============================================
    // FAVORITOS
    // ============================================
    function toggleFavorite(product, button) {
        const index = favorites.findIndex(fav => fav.id === product.id);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            favorites.push(product);
            button.classList.add('active');
            icon.className = 'fas fa-heart';
            showNotification(`¡${product.name} agregado a favoritos!`, 'success');
        } else {
            favorites.splice(index, 1);
            button.classList.remove('active');
            icon.className = 'far fa-heart';
            showNotification(`${product.name} eliminado de favoritos`, 'info');
        }
        
        updateFavoritesCount();
        saveFavorites();
        loadFavoritesItems();
    }

    function updateFavoritesCount() {
        if (elements.favoritesCount) {
            elements.favoritesCount.textContent = favorites.length;
            elements.favoritesCount.setAttribute('aria-label', `${favorites.length} favoritos`);
        }
    }

    function loadFavoritesItems() {
        const emptyFavorites = document.querySelector('.empty-favorites');
        
        if (!elements.favoritesItems) return;
        
        if (favorites.length === 0) {
            if (emptyFavorites) emptyFavorites.style.display = 'block';
            elements.favoritesItems.innerHTML = '';
            return;
        }
        
        if (emptyFavorites) emptyFavorites.style.display = 'none';
        elements.favoritesItems.innerHTML = '';
        
        favorites.forEach(item => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.setAttribute('data-id', item.id);
            
            favoriteItem.innerHTML = `
                <div class="favorite-item-img" style="background-color: #${getRandomColor()}"></div>
                <div class="favorite-item-info">
                    <div class="favorite-item-title">${item.name}</div>
                    <div class="favorite-item-price">$${item.price.toLocaleString('es-AR')}</div>
                    <div class="favorite-item-actions">
                        <button class="btn btn-primary btn-sm add-from-favorite">
                            <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                        <button class="remove-item" aria-label="Eliminar de favoritos">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Event listeners
            const addBtn = favoriteItem.querySelector('.add-from-favorite');
            const removeBtn = favoriteItem.querySelector('.remove-item');
            
            addBtn.addEventListener('click', () => {
                if (item.inStock) {
                    addToCart(item);
                } else {
                    showNotification('Este producto está agotado', 'warning');
                }
            });
            
            removeBtn.addEventListener('click', () => removeFromFavorites(item.id));
            
            elements.favoritesItems.appendChild(favoriteItem);
        });
    }

    function removeFromFavorites(productId) {
        const item = favorites.find(item => item.id === productId);
        favorites = favorites.filter(item => item.id !== productId);
        
        updateFavoritesCount();
        saveFavorites();
        loadFavoritesItems();
        
        // Actualizar botón en la página principal
        const productCard = document.querySelector(`.product-card[data-id="${productId}"] .btn-favorite`);
        if (productCard) {
            productCard.classList.remove('active');
            productCard.querySelector('i').className = 'far fa-heart';
        }
        
        if (item) {
            showNotification(`${item.name} eliminado de favoritos`, 'info');
        }
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // ============================================
    // NOTIFICACIONES
    // ============================================
    function showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Estilos dinámicos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#27ae60' : 
                             type === 'warning' ? '#f39c12' : 
                             type === 'error' ? '#e53935' : '#8B4513'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Ocultar después de 4 segundos
        const timeout = setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        // Permitir cerrar manualmente
        notification.addEventListener('click', () => {
            clearTimeout(timeout);
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // ============================================
    // ANIMACIONES Y FEEDBACK VISUAL
    // ============================================
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    function animateCartIcon() {
        if (elements.cartBtn) {
            elements.cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                elements.cartBtn.style.transform = '';
            }, 300);
        }
    }

    function showSkeletonLoading() {
        if (!elements.productsGrid) return;
        
        elements.productsGrid.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'product-card skeleton';
            skeleton.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="card-body">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text" style="width: 60%;"></div>
                </div>
            `;
            elements.productsGrid.appendChild(skeleton);
        }
    }

    // ============================================
    // BÚSQUEDA Y FILTROS
    // ============================================
    function performSearch() {
        if (!elements.searchInput) return;
        
        const query = elements.searchInput.value.toLowerCase().trim();
        
        if (!query) {
            renderProducts(products.filter(p => p.featured));
            return;
        }
        
        // Filtrar productos
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.material.toLowerCase().includes(query)
        );
        
        // Renderizar resultados
        renderProducts(filteredProducts);
        
        // Feedback al usuario
        if (filteredProducts.length === 0) {
            showNotification(`No se encontraron resultados para "${query}"`, 'info');
        } else {
            showNotification(`Se encontraron ${filteredProducts.length} productos`, 'success');
        }
    }

    // ============================================
    // PREFERENCIAS DEL USUARIO
    // ============================================
    function loadUserPreferences() {
        // Cargar moneda
        if (elements.currencySelector) {
            elements.currencySelector.value = currency;
            elements.currencySelector.addEventListener('change', (e) => {
                currency = e.target.value;
                localStorage.setItem('currency', currency);
                showNotification(`Moneda cambiada a ${currency}`, 'info');
            });
        }
        
        // Cargar idioma
        if (elements.languageSelector) {
            elements.languageSelector.value = language;
            elements.languageSelector.addEventListener('change', (e) => {
                language = e.target.value;
                localStorage.setItem('language', language);
                showNotification(`Idioma cambiado a ${language === 'es' ? 'Español' : 'English'}`, 'info');
            });
        }
    }

    // ============================================
    // GESTIÓN DE EVENTOS
    // ============================================
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Carrito
        if (elements.cartBtn) {
            elements.cartBtn.addEventListener('click', openCart);
        }
        
        if (elements.closeCartBtn) {
            elements.closeCartBtn.addEventListener('click', closeCart);
        }
        
        if (elements.cartOverlay) {
            elements.cartOverlay.addEventListener('click', closeCart);
        }
        
        // Favoritos
        if (elements.favoritesBtn) {
            elements.favoritesBtn.addEventListener('click', openFavorites);
        }
        
        if (elements.closeFavoritesBtn) {
            elements.closeFavoritesBtn.addEventListener('click', closeFavorites);
        }
        
        if (elements.favoritesOverlay) {
            elements.favoritesOverlay.addEventListener('click', closeFavorites);
        }
        
        // Login
        if (elements.loginBtn) {
            elements.loginBtn.addEventListener('click', openLogin);
        }
        
        if (elements.closeLoginBtn) {
            elements.closeLoginBtn.addEventListener('click', closeLogin);
        }
        
        if (elements.loginOverlay) {
            elements.loginOverlay.addEventListener('click', closeLogin);
        }
        
        // Formulario de login
        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', handleLogin);
        }
        
        // Búsqueda
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', debounce(performSearch, 300));
            elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        if (elements.searchButton) {
            elements.searchButton.addEventListener('click', performSearch);
        }
        
        // Menú móvil
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // Dropdowns
        if (elements.dropdowns) {
            elements.dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('a');
                const content = dropdown.querySelector('.dropdown-content');
                
                if (toggle && content) {
                    // Desktop - hover
                    dropdown.addEventListener('mouseenter', () => {
                        if (window.innerWidth >= 992) {
                            dropdown.classList.add('active');
                        }
                    });
                    
                    dropdown.addEventListener('mouseleave', () => {
                        if (window.innerWidth >= 992) {
                            dropdown.classList.remove('active');
                        }
                    });
                    
                    // Mobile - click
                    toggle.addEventListener('click', (e) => {
                        if (window.innerWidth < 992) {
                            e.preventDefault();
                            dropdown.classList.toggle('active');
                            
                            // Cerrar otros dropdowns
                            elements.dropdowns.forEach(other => {
                                if (other !== dropdown) {
                                    other.classList.remove('active');
                                }
                            });
                        }
                    });
                }
            });
        }
        
        // Checkout
        if (elements.checkoutBtn) {
            elements.checkoutBtn.addEventListener('click', handleCheckout);
        }
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle')) {
                    closeMobileMenu();
                }
            }
        });
        
        // Escuchar cambios en el tamaño de la ventana
        window.addEventListener('resize', handleResize);
        
        // Prevenir formularios de recargar la página
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (form === elements.loginForm) return; // El login ya tiene manejador
                e.preventDefault();
            });
        });
    }

    // ============================================
    // FUNCIONES DE MANEJO DE INTERFAZ
    // ============================================
    function openCart() {
        if (elements.cartSidebar) elements.cartSidebar.classList.add('active');
        if (elements.cartOverlay) elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (elements.cartSidebar) elements.cartSidebar.classList.remove('active');
        if (elements.cartOverlay) elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openFavorites() {
        if (elements.favoritesSidebar) elements.favoritesSidebar.classList.add('active');
        if (elements.favoritesOverlay) elements.favoritesOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFavorites() {
        if (elements.favoritesSidebar) elements.favoritesSidebar.classList.remove('active');
        if (elements.favoritesOverlay) elements.favoritesOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openLogin(e) {
        e.preventDefault();
        if (elements.loginModal) elements.loginModal.classList.add('active');
        if (elements.loginOverlay) elements.loginOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLogin() {
        if (elements.loginModal) elements.loginModal.classList.remove('active');
        if (elements.loginOverlay) elements.loginOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMobileMenu() {
        if (elements.navMenu) elements.navMenu.classList.toggle('active');
        if (elements.menuToggle) elements.menuToggle.classList.toggle('active');
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (elements.navMenu) elements.navMenu.classList.remove('active');
        if (elements.menuToggle) elements.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleResize() {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    }

    // ============================================
    // MANEJADORES DE EVENTOS
    // ============================================
    function handleLogin(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
            showNotification('Por favor completa todos los campos', 'warning');
            return;
        }
        
        // Simular inicio de sesión
        showNotification('Iniciando sesión...', 'info');
        
        setTimeout(() => {
            closeLogin();
            showNotification('¡Bienvenido a GL Cuchillos Artesanales!', 'success');
            
            // Actualizar interfaz
            if (elements.loginBtn) {
                elements.loginBtn.innerHTML = '<i class="fas fa-user"></i> Mi Cuenta';
            }
        }, 1500);
    }

    function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'warning');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        showNotification(`Procesando compra por $${total.toLocaleString('es-AR')}...`, 'info');
        
        // Simular procesamiento
        setTimeout(() => {
            // Guardar historial
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: cart,
                total: total,
                status: 'completado'
            };
            
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.unshift(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Limpiar carrito
            cart = [];
            saveCart();
            updateCartCount();
            loadCartItems();
            closeCart();
            
            showNotification('¡Compra realizada con éxito! Recibirás un email de confirmación.', 'success');
        }, 2000);
    }

    // ============================================
    // ACCESIBILIDAD
    // ============================================
    function setupAccessibility() {
        // Mejorar navegación por teclado
        document.addEventListener('keydown', (e) => {
            // Escape cierra modales
            if (e.key === 'Escape') {
                closeCart();
                closeFavorites();
                closeLogin();
                closeMobileMenu();
            }
        });
        
        // Mejorar focus management
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modals = document.querySelectorAll('.cart-sidebar, .favorites-sidebar, .login-modal');
        
        modals.forEach(modal => {
            const focusableContent = modal.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        });
        
        // Añadir labels ARIA
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            const isActive = btn.classList.contains('active');
            btn.setAttribute('aria-label', isActive ? 'Eliminar de favoritos' : 'Agregar a favoritos');
        });
    }

    // ============================================
    // UTILIDADES
    // ============================================
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
    // INICIALIZAR APLICACIÓN
    // ============================================
    init();
});
