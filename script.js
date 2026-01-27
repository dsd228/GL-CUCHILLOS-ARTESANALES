document.addEventListener('DOMContentLoaded', function() {
    // Datos de productos de ejemplo
    const products = [
        {
            id: 1,
            name: "Cuchillo Chef Damasco",
            price: 24500,
            category: "Cuchillos de Chef",
            image: "cuchillo1.jpg",
            description: "Hoja de acero Damasco, mango de madera de olivo",
            featured: true,
            inStock: true
        },
        {
            id: 2,
            name: "Cuchillo Caza Táctico",
            price: 18900,
            category: "Cuchillos de Caza",
            image: "cuchillo2.jpg",
            description: "Hoja de acero al carbono, mango micarta",
            featured: true,
            inStock: true
        },
        {
            id: 3,
            name: "Cuchillo Parrillero",
            price: 12500,
            category: "Juegos",
            image: "cuchillo3.jpg",
            description: "Hoja inoxidable, mango de resina epoxi",
            featured: true,
            inStock: true
        },
        {
            id: 4,
            name: "Cuchillo Plegable",
            price: 15600,
            category: "Cuchillos",
            image: "cuchillo4.jpg",
            description: "Diseño compacto, hoja de acero inoxidable",
            featured: true,
            inStock: true
        },
        {
            id: 5,
            name: "Juego 6 Cuchillos",
            price: 68500,
            category: "Juegos",
            image: "cuchillo5.jpg",
            description: "Set completo para cocina profesional",
            featured: true,
            inStock: true
        },
        {
            id: 6,
            name: "Cuchillo Decorativo",
            price: 32000,
            category: "Cuchillos",
            image: "cuchillo6.jpg",
            description: "Hoja Damasco, mango de asta con incrustaciones",
            featured: true,
            inStock: false
        },
        {
            id: 7,
            name: "Mango Madera Nogal",
            price: 4500,
            category: "Mangos",
            image: "mango1.jpg",
            description: "Mango de madera de nogal para personalización",
            featured: false,
            inStock: true
        },
        {
            id: 8,
            name: "Mango Micarta Rojo",
            price: 3800,
            category: "Mangos",
            image: "mango2.jpg",
            description: "Mango de micarta color rojo, textura antideslizante",
            featured: false,
            inStock: true
        }
    ];

    // Estado de la aplicación
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currency = 'ARS';
    let language = 'es';

    // Elementos del DOM
    const productsGrid = document.getElementById('products-grid');
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const favoritesBtn = document.querySelector('.favorites');
    const favoritesSidebar = document.querySelector('.favorites-sidebar');
    const favoritesOverlay = document.querySelector('.favorites-overlay');
    const closeFavoritesBtn = document.querySelector('.close-favorites');
    const favoritesItems = document.querySelector('.favorites-items');
    const favoritesCount = document.querySelector('.favorites-count');
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.querySelector('.login-modal');
    const loginOverlay = document.querySelector('.login-overlay');
    const closeLoginBtn = document.querySelector('.close-login');
    const searchInput = document.querySelector('.search-box input');
    const currencySelector = document.querySelector('.currency-selector');
    const languageSelector = document.querySelector('.language-selector');

    // Inicializar la aplicación
    function init() {
        renderProducts();
        updateCartCount();
        updateFavoritesCount();
        loadCartItems();
        loadFavoritesItems();
        setupEventListeners();
    }

    // Renderizar productos en la página
    function renderProducts() {
        productsGrid.innerHTML = '';
        
        products.filter(product => product.featured).forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    // Crear tarjeta de producto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const isFavorite = favorites.some(fav => fav.id === product.id);
        
        card.innerHTML = `
            ${!product.inStock ? '<span class="product-badge">Agotado</span>' : ''}
            <div class="product-img" style="background-color: #${getRandomColor()}"></div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                    <button class="btn-favorite ${isFavorite ? 'active' : ''}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners para los botones
        const addToCartBtn = card.querySelector('.btn-add-cart');
        const favoriteBtn = card.querySelector('.btn-favorite');
        
        if (product.inStock) {
            addToCartBtn.addEventListener('click', () => addToCart(product));
        }
        
        favoriteBtn.addEventListener('click', () => toggleFavorite(product, favoriteBtn));
        
        return card;
    }

    // Función auxiliar para color aleatorio
    function getRandomColor() {
        const colors = ['8B4513', 'D2691E', 'A0522D', 'CD853F', 'A52A2A', '8B0000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Agregar producto al carrito
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCount();
        saveCart();
        showNotification(`${product.name} agregado al carrito`);
        loadCartItems();
    }

    // Alternar favorito
    function toggleFavorite(product, button) {
        const index = favorites.findIndex(fav => fav.id === product.id);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            favorites.push(product);
            button.classList.add('active');
            icon.className = 'fas fa-heart';
            showNotification(`${product.name} agregado a favoritos`);
        } else {
            favorites.splice(index, 1);
            button.classList.remove('active');
            icon.className = 'far fa-heart';
            showNotification(`${product.name} eliminado de favoritos`);
        }
        
        updateFavoritesCount();
        saveFavorites();
        loadFavoritesItems();
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Actualizar contador de favoritos
    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }

    // Cargar items del carrito
    function loadCartItems() {
        const emptyCart = document.querySelector('.empty-cart');
        const cartTotal = document.querySelector('.total-price');
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartTotal.textContent = '$0';
            return;
        }
        
        emptyCart.style.display = 'none';
        cartItems.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-img" style="background-color: #${getRandomColor()}"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Event listeners para los controles de cantidad
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const quantityInput = cartItem.querySelector('.quantity-input');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            minusBtn.addEventListener('click', () => updateQuantity(item.id, -1, quantityInput));
            plusBtn.addEventListener('click', () => updateQuantity(item.id, 1, quantityInput));
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = `$${total.toLocaleString()}`;
    }

    // Cargar items de favoritos
    function loadFavoritesItems() {
        const emptyFavorites = document.querySelector('.empty-favorites');
        
        if (favorites.length === 0) {
            emptyFavorites.style.display = 'block';
            return;
        }
        
        emptyFavorites.style.display = 'none';
        favoritesItems.innerHTML = '';
        
        favorites.forEach(item => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            
            favoriteItem.innerHTML = `
                <div class="favorite-item-img" style="background-color: #${getRandomColor()}"></div>
                <div class="favorite-item-info">
                    <div class="favorite-item-title">${item.name}</div>
                    <div class="favorite-item-price">$${item.price.toLocaleString()}</div>
                    <div class="favorite-item-actions">
                        <button class="btn-add-cart">Agregar al Carrito</button>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Event listeners
            const addToCartBtn = favoriteItem.querySelector('.btn-add-cart');
            const removeBtn = favoriteItem.querySelector('.remove-item');
            
            addToCartBtn.addEventListener('click', () => addToCart(item));
            removeBtn.addEventListener('click', () => removeFromFavorites(item.id));
            
            favoritesItems.appendChild(favoriteItem);
        });
    }

    // Actualizar cantidad en carrito
    function updateQuantity(productId, change, inputElement) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity < 1) {
                removeFromCart(productId);
                return;
            }
            
            inputElement.value = item.quantity;
            updateCartCount();
            saveCart();
            loadCartItems();
        }
    }

    // Eliminar del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        saveCart();
        loadCartItems();
        showNotification('Producto eliminado del carrito');
    }

    // Eliminar de favoritos
    function removeFromFavorites(productId) {
        favorites = favorites.filter(item => item.id !== productId);
        updateFavoritesCount();
        saveFavorites();
        loadFavoritesItems();
        
        // Actualizar botón en la página principal
        const productCard = document.querySelector(`.product-card .btn-favorite.active`);
        if (productCard) {
            productCard.classList.remove('active');
            productCard.querySelector('i').className = 'far fa-heart';
        }
        
        showNotification('Producto eliminado de favoritos');
    }

    // Mostrar notificación
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #8B4513;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 2000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Guardar favoritos en localStorage
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Carrito
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
        
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        
        // Favoritos
        favoritesBtn.addEventListener('click', () => {
            favoritesSidebar.classList.add('active');
            favoritesOverlay.classList.add('active');
        });
        
        closeFavoritesBtn.addEventListener('click', closeFavorites);
        favoritesOverlay.addEventListener('click', closeFavorites);
        
        // Login
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
            loginOverlay.classList.add('active');
        });
        
        closeLoginBtn.addEventListener('click', closeLogin);
        loginOverlay.addEventListener('click', closeLogin);
        
        // Búsqueda
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Selectores de moneda e idioma
        currencySelector.addEventListener('change', (e) => {
            currency = e.target.value;
            // Aquí iría la lógica para convertir precios
        });
        
        languageSelector.addEventListener('change', (e) => {
            language = e.target.value;
            // Aquí iría la lógica para cambiar idioma
        });
        
        // Formulario de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Inicio de sesión simulado para esta demostración');
                closeLogin();
            });
        }
        
        // Botón de finalizar compra
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('El carrito está vacío');
                    return;
                }
                
                alert(`Compra simulada por un total de $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}`);
                cart = [];
                saveCart();
                updateCartCount();
                loadCartItems();
                closeCart();
            });
        }
        
        // Menú móvil
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navCenter = document.querySelector('.nav-center');
                navCenter.style.display = navCenter.style.display === 'block' ? 'none' : 'block';
            });
        }
        
        // Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-content').style.display = 'flex';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-content').style.display = 'none';
            });
        });
    }

    // Cerrar carrito
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    // Cerrar favoritos
    function closeFavorites() {
        favoritesSidebar.classList.remove('active');
        favoritesOverlay.classList.remove('active');
    }

    // Cerrar login
    function closeLogin() {
        loginModal.classList.remove('active');
        loginOverlay.classList.remove('active');
    }

    // Realizar búsqueda
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) return;
        
        // Filtrar productos
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        // Actualizar la vista
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <h3>No se encontraron productos para "${query}"</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
        } else {
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
        
        showNotification(`Se encontraron ${filteredProducts.length} productos para "${query}"`);
    }

    // Agregar estilos de animación para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Inicializar la aplicación
    init();
});
