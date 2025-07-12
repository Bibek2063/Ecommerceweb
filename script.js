// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Set up page-specific functionality
    setupPage();
});

// Global Variables
let currentUser = null;
let products = [];
let cart = [];
let orders = [];

// Initialize Application
function initApp() {
    // Load user data if logged in
    loadUser();
    
    // Load product data
    loadProducts();
    
    // Load cart from localStorage
    loadCart();
    
    // Load orders if user is logged in
    if (currentUser) {
        loadOrders();
    }
    
    // Set up event listeners for navigation
    setupNavigation();
    
    // Initialize search functionality
    initSearch();
    
    // Update UI based on user state
    updateUI();
}

// Page-Specific Setup
// In your setupPage() function's switch statement
case 'product.html':  // This should be for product.html, not index.html
  (function() {
    let currentProductId = null;

    function checkAndLoadProduct() {
      const productId = getProductIdFromUrl();
      
      if (!productId) {
        window.location.href = 'index.html';
        return;
      }
      
      if (productId !== currentProductId) {
        currentProductId = productId;
        loadProductDetails(productId);
        setupProductGallery();
        setupProductTabs();
        setupAddToCart();
      }
    }

    // Initial load
    checkAndLoadProduct();
    
    // Handle back/forward navigation
    window.addEventListener('popstate', checkAndLoadProduct);
    
    // Check navigation type
    if (performance.getEntriesByType("navigation").length > 0 && 
        performance.getEntriesByType("navigation")[0].type === "navigate") {
      window.location.reload();
    }
  })();
  break;

// Setup Home Page
function setupHomePage() {
    // Display featured products
    displayFeaturedProducts();
    
    // Display deals of the day
    displayDealsOfTheDay();
    
    // Display recommended products
    displayRecommendedProducts();
    
    // Set up category navigation
    setupCategoryNavigation();
    
    // Set up quick view modal
    setupQuickView();
}

// Setup Product Page
case 'product.html':
  // Remove any existing setupProductPage() call and replace with:
  let currentProductId = null;

  function setupProductPage() {
    const productId = getProductIdFromUrl();
    
    if (!productId) {
      window.location.href = 'index.html';
      return;
    }
    
    if (productId !== currentProductId) {
      currentProductId = productId;
      loadProductDetails(productId);
    }
  }

  // Run on initial load and when URL changes
  window.addEventListener('load', setupProductPage);
  window.addEventListener('popstate', setupProductPage);
  break;

// Setup Cart Page
function setupCartPage() {
    // Display cart items
    displayCartItems();
    
    // Set up cart item controls
    setupCartItemControls();
    
    // Set up promo code functionality
    setupPromoCode();
    
    // Set up checkout button
    setupCheckoutButton();
    
    // Display recently viewed items
    displayRecentlyViewed();
}

// Setup Orders Page
function setupOrdersPage() {
    // Display order history
    displayOrderHistory();
    
    // Set up order filtering
    setupOrderFilters();
    
    // Set up order actions
    setupOrderActions();
}

// Setup Admin Page
function setupAdminPage() {
    // Load admin stats
    loadAdminStats();
    
    // Set up admin charts
    setupAdminCharts();
    
    // Display recent orders
    displayRecentOrders();
    
    // Display top products
    displayTopProducts();
    
    // Set up admin sidebar toggle for mobile
    setupAdminSidebarToggle();
}

// Navigation Functions
function setupNavigation() {
    // Handle navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default for demo purposes
            e.preventDefault();
            
            // Get the target page
            const target = this.getAttribute('href');
            
            // Navigate to the target page
            navigateTo(target);
        });
    });
    
    // Handle logo click
    document.querySelector('.logo a').addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo('index.html');
    });
}

function navigateTo(page) {
    // In a real app, this would use a router or load content dynamically
    window.location.href = page;
}

// User Management
function loadUser() {
    // In a real app, this would check for a logged-in user via session or token
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function loginUser(email, password) {
    // In a real app, this would make an API call
    // For demo, we'll use mock data
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', isAdmin: false },
        { id: 2, name: 'Admin User', email: 'admin@example.com', isAdmin: true }
    ];
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUI();
        return true;
    }
    
    return false;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
}

function updateUI() {
    // Update user display
    const userElements = document.querySelectorAll('.user-actions a');
    
    if (currentUser) {
        userElements[0].innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        userElements[0].href = '#';
        userElements[0].addEventListener('click', function(e) {
            e.preventDefault();
            // Show account dropdown or navigate to account page
        });
        
        // Show logout option
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
        
        // Replace or add logout link
        if (userElements.length > 3) {
            userElements[2].replaceWith(logoutLink);
        } else {
            document.querySelector('.user-actions').appendChild(logoutLink);
        }
    } else {
        userElements[0].innerHTML = '<i class="fas fa-user"></i> Sign In';
        userElements[0].href = 'login.html'; // Would need a login page
        
        // Remove logout link if present
        if (userElements.length > 3) {
            userElements[2].remove();
        }
    }
    
    // Update cart count
    updateCartCount();
}

// Product Management
function loadProducts() {
    // In a real app, this would be an API call
    // Mock product data
    products = [
        { id: 1, name: 'Apple AirPods Pro (2nd Generation)', price: 199.99, oldPrice: 249.99, category: 'electronics', rating: 4.5, reviews: 1245, image: 'https://imgs.search.brave.com/4UkzQ2Gm9zhfj7tDWGrzS1ZhUmSxREAwCAAB0Nhymd4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9pbGx1c3RyYXRp/b24tYWlycG9kcy1w/cm8tMmctd2l0aG91/dC1iYWNrZ3JvdW5k/LWdlbmVyYXRpdmUt/YWlfNzU2NDA1LTcw/MTc5LmpwZz9zZW10/PWFpc19pdGVtc19i/b29zdGVkJnc9NzQw', description: 'Active Noise Cancellation blocks outside noise...', features: ['Active Noise Cancellation', 'Transparency mode', 'Spatial audio'] },
        { id: 2, name: 'Samsung 55" 4K Smart TV', price: 499.99, oldPrice: 599.99, category: 'electronics', rating: 4.0, reviews: 892, image: 'https://imgs.search.brave.com/jJ3FtIEDfioe0Qx2YFJLbqkKmZJ_xxLZQjm6zW1P3b0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFibFNpckVqT0wu/anBn', description: 'Crystal clear 4K resolution...', features: ['4K UHD resolution', 'Smart TV capabilities', 'HDR'] },
        { id: 3, name: 'Instant Pot Duo 7-in-1', price: 79.99, oldPrice: 99.99, category: 'home', rating: 4.8, reviews: 2453, image: 'https://imgs.search.brave.com/id7G0a7b50yWnkgjQtZghfB7aRHyB9mSfee4sCxHSJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFrSS1IOVZoMEwu/anBn', description: '7-in-1 functionality...', features: ['Pressure cooker', 'Slow cooker', 'Rice cooker'] },
        { id: 4, name: 'Nintendo Switch - Neon', price: 299.99, category: 'electronics', rating: 4.7, reviews: 1876, image: 'https://via.placeholder.com/200', description: 'Hybrid gaming console...', features: ['Portable and docked play', 'Joy-Con controllers', 'Multiplayer'] },
        { id: 5, name: 'Apple AirPods (3rd Generation)', price: 169.99, category: 'electronics', rating: 4.3, reviews: 876, image: 'https://imgs.search.brave.com/3C3I-XiSMu70BwIpDVG2lnwcDGrh0OY-iqCFMSZCLY8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQXBw/bGUtQWlyUG9kcy0z/cmQtR2VuZXJhdGlv/bl82Nzc2YTQyMi0x/MWFmLTRkZmMtOGFl/Zi00MGMwYjRlYTcx/YWMuYzBjMmYzMmEx/ZWI2YzcyZWIyODU4/MjQzNjA2MWQ0ZTYu/anBlZz9vZG5IZWln/aHQ9NTczJm9kbldp/ZHRoPTU3MyZvZG5C/Zz1GRkZGRkY', description: 'Spatial audio with dynamic head tracking...', features: ['Spatial audio', 'Sweat and water resistant', 'Long battery life'] },
        { id: 6, name: 'Sony WH-1000XM4 Headphones', price: 348.00, oldPrice: 399.99, category: 'electronics', rating: 4.9, reviews: 1543, image: 'https://m.media-amazon.com/images/I/51JNqP2C4rL.__AC_SY445_SX342_QL70_FMwebp_.jpg', description: 'Industry-leading noise cancellation...', features: ['Noise cancellation', '30-hour battery', 'Touch controls'] },
        { id: 7, name: 'Apple AirPods Max', price: 499.99, category: 'electronics', rating: 4.6, reviews: 932, image: 'https://ideogram.ai/assets/progressive-image/fast/response/5f9p4SFmSq6s_ssLTkwDWQ', description: 'High-fidelity audio...', features: ['Active Noise Cancellation', 'Transparency mode', 'Spatial audio'] },
        { id: 8, name: 'Beats Fit Pro', price: 199.99, category: 'electronics', rating: 4.2, reviews: 654, image: 'https://imgs.search.brave.com/aau2IRkgJ0IGu-V5l5jPlp0pazE0rSGvr0L-VgTMFmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmVhdHNieWRyZS5j/b20vY29udGVudC9k/YW0vYmVhdHMvd2Vi/L3Byb2R1Y3QvZWFy/YnVkcy9iZWF0cy1m/aXQtcHJvL3BkcC9m/aXRwcm8tcGRwLXAw/Mi5wbmcubGFyZ2Uu/MngucG5n', description: 'Secure-fit wingtips...', features: ['Active Noise Cancellation', 'Sweat and water resistant', 'Long battery life'] },
        { id: 9, name: 'Apple Watch Series 8', price: 399.00, oldPrice: 429.00, category: 'electronics', rating: 4.4, reviews: 932, image: 'https://imgs.search.brave.com/zZCcrNRxfbMmhNKuid7m9kczmjzDAmQHzd3E-5cmHvg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y2l0eXBuZy5jb20v/cHVibGljL3VwbG9h/ZHMvcHJldmlldy9o/ZC1ibHVlLWFwcGxl/LXNtYXJ0LXdhdGNo/LXNlcmllcy02LXBu/Zy03MDQwODE2OTQ2/MjIxNzBvZ2Z1bHVj/eHc1LnBuZz92PTIw/MjUwMjEwMDQ', description: 'Advanced health monitoring...', features: ['Heart rate monitoring', 'ECG', 'Sleep tracking'] },
        { id: 10, name: 'Echo Dot (5th Gen)', price: 49.99, category: 'electronics', rating: 4.5, reviews: 2453, image: 'https://m.media-amazon.com/images/I/710exCeNPJL._AC_SY450_.jpg', description: 'Smart speaker with Alexa...', features: ['Voice control', 'Smart home hub', 'Compact design'] },
        { id: 11, name: 'PlayStation 5 Console', price: 499.99, category: 'electronics', rating: 5.0, reviews: 3210, image: 'https://m.media-amazon.com/images/I/31kTNmpm6vL._SX300_SY300_QL70_FMwebp_.jpg', description: 'Next-gen gaming console...', features: ['4K gaming', 'Ultra-high speed SSD', 'Haptic feedback'] }
    ];
}

function displayFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured-products .products-grid');
    
    if (featuredContainer) {
        // Get featured products (first 4 for demo)
        const featured = products.slice(0, 6);
        
        featuredContainer.innerHTML = featured.map(product => `
            <div class="product-card">
                <div class="product-badge">Featured</div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.featured-products .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function displayDealsOfTheDay() {
    const dealsContainer = document.querySelector('.deals .products-grid');
    
    if (dealsContainer) {
        // Get deals (products with oldPrice for demo)
        const deals = products.filter(p => p.oldPrice).slice(0, 6);
        
        dealsContainer.innerHTML = deals.map(product => `
            <div class="product-card">
                <div class="product-badge">Hot Deal</div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                    <span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.deals .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function displayRecommendedProducts() {
    const recommendedContainer = document.querySelector('.recommended-products .products-grid');
    
    if (recommendedContainer) {
        // Get recommended products (last 4 for demo)
        const recommended = products.slice(4);
        
        recommendedContainer.innerHTML = recommended.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.recommended-products .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Product Page Functions
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

function loadProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        // Update product images
        document.querySelector('.main-image img').src = product.image;
        document.querySelector('.thumbnail-images').innerHTML = `
            <img src="${product.image}" alt="Thumbnail 1">
            <img src="https://via.placeholder.com/100" alt="Thumbnail 2">
            <img src="https://via.placeholder.com/100" alt="Thumbnail 3">
            <img src="https://via.placeholder.com/100" alt="Thumbnail 4">
        `;
        
        // Update product info
        document.querySelector('.product-info h1').textContent = product.name;
        document.querySelector('.brand').textContent = `by ${product.name.split(' ')[0]}`;
        document.querySelector('.rating').innerHTML = `
            ${renderStars(product.rating)}
            <span>${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
            <a href="#reviews">See all reviews</a>
        `;
        
        document.querySelector('.price').innerHTML = `
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
        `;
        
        document.querySelector('.product-highlights ul').innerHTML = product.features.map(f => `
            <li>${f}</li>
        `).join('');
        
        // Update description tab
        document.querySelector('#description').innerHTML = `
            <h3>Product Description</h3>
            <p>${product.description}</p>
        `;
        
        // Update specifications tab
        document.querySelector('#specs').innerHTML = `
            <h3>Technical Specifications</h3>
            <table>
                <tr>
                    <th>Brand</th>
                    <td>${product.name.split(' ')[0]}</td>
                </tr>
                <tr>
                    <th>Model</th>
                    <td>${product.name}</td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>${product.category}</td>
                </tr>
                <tr>
                    <th>Price</th>
                    <td>$${product.price.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Rating</th>
                    <td>${product.rating.toFixed(1)} (${product.reviews} reviews)</td>
                </tr>
            </table>
        `;
    }
}

function setupProductGallery() {
    document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelector('.main-image img').src = this.src;
        });
    });
}

function setupProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupAddToCart() {
    document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        const productId = getProductIdFromUrl();
        const quantity = parseInt(document.querySelector('.quantity-selector input').value);
        
        if (productId) {
            addToCart(productId, quantity);
            showToast('Product added to cart!');
        }
    });
    
    document.querySelector('.buy-now-btn').addEventListener('click', function() {
        const productId = getProductIdFromUrl();
        const quantity = parseInt(document.querySelector('.quantity-selector input').value);
        
        if (productId) {
            addToCart(productId, quantity);
            window.location.href = 'cart.html';
        }
    });
}

function displayRelatedProducts(productId) {
    const relatedContainer = document.querySelector('.recommended-products .products-grid');
    
    if (relatedContainer) {
        // Get current product
        const currentProduct = products.find(p => p.id == productId);
        
        if (currentProduct) {
            // Get related products (same category, excluding current)
            const related = products.filter(p => 
                p.category === currentProduct.category && 
                p.id != currentProduct.id
            ).slice(0, 4);
            
            relatedContainer.innerHTML = related.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join('');
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.recommended-products .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    addToCart(this.getAttribute('data-id'));
                });
            });
        }
    }
}

// Cart Functions
function loadCart() {
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
        cart = JSON.parse(cartData);
    } else {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                quantity: quantity,
                price: product.price,
                name: product.name,
                image: product.image
            });
        }
        
        saveCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartCount();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id == productId);
    
    if (item) {
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            removeFromCart(productId);
        }
        
        saveCart();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id == item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = count;
    });
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="index.html" class="btn">Continue Shopping</a>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => {
                const product = products.find(p => p.id == item.id);
                
                if (product) {
                    return `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="item-image">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="item-details">
                                <h3 class="item-title">${product.name}</h3>
                                <div class="item-price">$${product.price.toFixed(2)}</div>
                                <div class="item-availability"><i class="fas fa-check-circle"></i> In stock</div>
                                <div class="item-delivery">Free delivery <strong>Tomorrow</strong></div>
                                <div class="item-actions">
                                    <div class="quantity-selector">
                                        <button class="qty-minus">-</button>
                                        <input type="number" value="${item.quantity}" min="1" max="10">
                                        <button class="qty-plus">+</button>
                                    </div>
                                    <button class="save-for-later"><i class="far fa-bookmark"></i> Save for later</button>
                                    <button class="remove-item"><i class="far fa-trash-alt"></i> Remove</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                return '';
            }).join('');
            
            // Set up cart item controls
            setupCartItemControls();
            
            // Update cart summary
            updateCartSummary();
        }
    }
}

function setupCartItemControls() {
    // Quantity minus
    document.querySelectorAll('.qty-minus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const newQty = parseInt(input.value) - 1;
            
            if (newQty >= 1) {
                input.value = newQty;
                const productId = this.closest('.cart-item').getAttribute('data-id');
                updateCartItemQuantity(productId, newQty);
                displayCartItems(); // Refresh display
            }
        });
    });
    
    // Quantity plus
    document.querySelectorAll('.qty-plus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const newQty = parseInt(input.value) + 1;
            
            if (newQty <= 10) {
                input.value = newQty;
                const productId = this.closest('.cart-item').getAttribute('data-id');
                updateCartItemQuantity(productId, newQty);
                displayCartItems(); // Refresh display
            }
        });
    });
    
    // Quantity input change
    document.querySelectorAll('.quantity-selector input').forEach(input => {
        input.addEventListener('change', function() {
            const newQty = parseInt(this.value);
            const productId = this.closest('.cart-item').getAttribute('data-id');
            
            if (newQty >= 1 && newQty <= 10) {
                updateCartItemQuantity(productId, newQty);
                displayCartItems(); // Refresh display
            } else {
                this.value = cart.find(item => item.id == productId).quantity;
            }
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.closest('.cart-item').getAttribute('data-id');
            removeFromCart(productId);
            displayCartItems(); // Refresh display
        });
    });
    
    // Save for later
    document.querySelectorAll('.save-for-later').forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would move to a "saved for later" list
            showToast('Item saved for later');
        });
    });
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const tax = subtotal * 0.07; // 7% tax for demo
    const total = subtotal + tax;
    
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
}

function setupPromoCode() {
    const applyBtn = document.querySelector('.apply-btn');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const promoCode = document.querySelector('.promo-code input').value;
            
            if (promoCode) {
                // In a real app, this would validate the promo code
                showToast('Promo code applied: 10% off');
            } else {
                showToast('Please enter a promo code');
            }
        });
    }
}

function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                if (currentUser) {
                    // In a real app, proceed to checkout
                    window.location.href = 'checkout.html';
                } else {
                    // Redirect to login
                    window.location.href = 'login.html?redirect=checkout.html';
                }
            } else {
                showToast('Your cart is empty');
            }
        });
    }
}

function displayRecentlyViewed() {
    const recentlyViewedContainer = document.querySelector('.recently-viewed .products-grid');
    
    if (recentlyViewedContainer) {
        // Get recently viewed from localStorage
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        
        // Get products that match the IDs
        const viewedProducts = recentlyViewed.map(id => 
            products.find(p => p.id == id)
        ).filter(p => p).slice(0, 4);
        
        if (viewedProducts.length > 0) {
            recentlyViewedContainer.innerHTML = viewedProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join('');
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.recently-viewed .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    addToCart(this.getAttribute('data-id'));
                });
            });
        } else {
            recentlyViewedContainer.innerHTML = `
                <div class="empty-recent">
                    <p>Your recently viewed items will appear here</p>
                </div>
            `;
        }
    }
}

// Orders Functions
function loadOrders() {
    // In a real app, this would be an API call for the current user's orders
    // Mock order data
    orders = [
        {
            id: 'WMT-2023-987654',
            date: '2023-10-15',
            status: 'delivered',
            deliveryDate: '2023-10-17',
            total: 748.98,
            items: [
                { id: 1, name: 'Apple AirPods Pro (2nd Generation)', price: 199.99, quantity: 1 },
                { id: 2, name: 'Samsung 55" 4K Smart TV', price: 499.99, quantity: 1 }
            ]
        },
        {
            id: 'WMT-2023-123456',
            date: '2023-09-28',
            status: 'delivered',
            deliveryDate: '2023-09-30',
            total: 129.97,
            items: [
                { id: 3, name: 'Instant Pot Duo 7-in-1', price: 79.99, quantity: 1 },
                { id: 10, name: 'Echo Dot (5th Gen)', price: 49.99, quantity: 1 }
            ]
        }
    ];
}

function displayOrderHistory() {
    const ordersContainer = document.querySelector('.orders-list');
    
    if (ordersContainer) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-box-open"></i>
                    <h3>You haven't placed any orders yet</h3>
                    <p>Start shopping to see your order history here</p>
                    <a href="index.html" class="btn">Start Shopping</a>
                </div>
            `;
        } else {
            ordersContainer.innerHTML = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <div class="order-number">Order #${order.id}</div>
                            <div class="order-date">Placed on ${formatDate(order.date)}</div>
                        </div>
                        <div class="order-status ${order.status}">
                            <i class="fas fa-check-circle"></i> Delivered on ${formatDate(order.deliveryDate)}
                        </div>
                        <div class="order-total">$${order.total.toFixed(2)}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div class="item-image">
                                    <img src="${products.find(p => p.id == item.id)?.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
                                </div>
                                <div class="item-details">
                                    <h3 class="item-title">${item.name}</h3>
                                    <div class="item-price">$${item.price.toFixed(2)}</div>
                                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <div class="item-actions">
                                    <button class="buy-again" data-id="${item.id}">Buy it again</button>
                                    <button class="view-product" data-id="${item.id}">View product</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <button class="track-order"><i class="fas fa-truck"></i> Track package</button>
                        <button class="leave-review"><i class="fas fa-star"></i> Leave a review</button>
                        <button class="return-item"><i class="fas fa-undo"></i> Start a return</button>
                    </div>
                </div>
            `).join('');
            
            // Set up order actions
            setupOrderActions();
        }
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupOrderFilters() {
    const filterTabs = document.querySelectorAll('.filter-tabs button');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // In a real app, this would filter the orders
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            showToast(`Showing ${this.textContent.toLowerCase()} orders`);
        });
    });
}

function setupOrderActions() {
    // Buy it again
    document.querySelectorAll('.buy-again').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
            showToast('Item added to cart');
        });
    });
    
    // View product
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
    
    // Track package
    document.querySelectorAll('.track-order').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Tracking information would be displayed here');
        });
    });
    
    // Leave review
    document.querySelectorAll('.leave-review').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Product review form would be displayed here');
        });
    });
    
    // Start return
    document.querySelectorAll('.return-item').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Return process would be initiated here');
        });
    });
}

// Admin Functions
function loadAdminStats() {
    // In a real app, this would be an API call
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = '1,245';
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = '$89,245';
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = '3,421';
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = '12,543';
}

function setupAdminCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [12500, 19000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 0, 0],
                backgroundColor: 'rgba(0, 114, 206, 0.1)',
                borderColor: '#0072ce',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Grocery', 'Home', 'Clothing', 'Toys', 'Other'],
            datasets: [{
                data: [35, 25, 15, 10, 8, 7],
                backgroundColor: [
                    '#0072ce',
                    '#ffc220',
                    '#76b900',
                    '#e31937',
                    '#9147ff',
                    '#777777'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function displayRecentOrders() {
    const ordersTable = document.querySelector('.orders-table tbody');
    
    if (ordersTable) {
        // Get recent orders (first 5 for demo)
        const recentOrders = orders.slice(0, 5);
        
        ordersTable.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][Math.floor(Math.random() * 5)]}</td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td><button class="action-btn view">View</button></td>
            </tr>
        `).join('');
        
        // Set up view buttons
        document.querySelectorAll('.action-btn.view').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.closest('tr').querySelector('td:first-child').textContent.slice(1);
                showToast(`Viewing order ${orderId}`);
            });
        });
    }
}

function displayTopProducts() {
    const topProductsContainer = document.querySelector('.top-products .products-grid');
    
    if (topProductsContainer) {
        // Get top products (first 5 for demo)
        const topProducts = products.slice(0, 5);
        
        topProductsContainer.innerHTML = topProducts.map((product, index) => `
            <div class="product-item">
                <div class="product-rank">${index + 1}</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-sales">${Math.floor(Math.random() * 2000) + 500} sold</div>
                </div>
                <div class="product-revenue">$${(product.price * (Math.floor(Math.random() * 2000) + 500)).toLocaleString()}</div>
            </div>
        `).join('');
    }
}

function setupAdminSidebarToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.className = 'admin-sidebar-toggle';
    
    document.querySelector('.admin-topbar').prepend(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        document.querySelector('.admin-sidebar').classList.toggle('active');
    });
    
    // Hide on larger screens
    function checkScreenSize() {
        if (window.innerWidth < 768) {
            toggleBtn.style.display = 'block';
        } else {
            toggleBtn.style.display = 'none';
            document.querySelector('.admin-sidebar').classList.remove('active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Search Functionality
function initSearch() {
    const searchForm = document.querySelector('.search-bar');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input').value.trim();
            
            if (query) {
                // In a real app, this would redirect to search results
                showToast(`Searching for: ${query}`);
            }
        });
    }
}

// Utility Functions
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupQuickView() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button
            if (!e.target.closest('button')) {
                const productId = this.querySelector('.add-to-cart')?.getAttribute('data-id');
                
                if (productId) {
                    // In a real app, this would show a quick view modal
                    showToast(`Quick view for product ${productId}`);
                }
            }
        });
    });
}

function setupCategoryNavigation() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent.toLowerCase();
            showToast(`Browsing ${category} category`);
        });
    });
}

// Add toast styles to the page
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }
    
    .toast.show {
        opacity: 1;
    }
`;
document.head.appendChild(toastStyles);